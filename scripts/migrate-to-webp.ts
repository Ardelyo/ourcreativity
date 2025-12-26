import { createClient } from '@supabase/supabase-js';
import { compressImage } from '../lib/image-compression';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role key
);

const migrateImagesToWebP = async () => {
    console.log('Starting migration to WebP...');

    // Get all files from storage
    const { data: files, error } = await supabase.storage
        .from('works')
        .list('', { limit: 1000 });

    if (error) {
        console.error('Error listing files:', error);
        return;
    }

    for (const file of files) {
        if (!file.name.match(/\.(jpg|jpeg|png)$/i)) continue;

        try {
            console.log(`Processing: ${file.name}`);

            // Download original file
            const { data: fileData, error: downloadError } = await supabase.storage
                .from('works')
                .download(file.name);

            if (downloadError || !fileData) {
                console.error(`Failed to download ${file.name}`);
                continue;
            }

            // Convert to WebP
            const originalFile = new File([fileData], file.name, { type: file.metadata?.mimetype });
            const webpFile = await compressImage(originalFile);

            // Upload WebP version
            const webpPath = file.name.replace(/\.[^.]+$/, '.webp');
            const { error: uploadError } = await supabase.storage
                .from('works')
                .upload(webpPath, webpFile, { upsert: true });

            if (uploadError) {
                console.error(`Failed to upload ${webpPath}:`, uploadError);
                continue;
            }

            console.log(`✓ Converted ${file.name} → ${webpPath}`);

            // Optional: Delete original file
            // await supabase.storage.from('works').remove([file.name]);
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
        }
    }

    console.log('Migration complete!');
};

migrateImagesToWebP();
