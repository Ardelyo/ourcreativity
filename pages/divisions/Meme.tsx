import React from 'react';
import { Link } from 'react-router-dom';

export const Meme = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'serif', lineHeight: '1.5', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/info" style={{ color: 'blue', textDecoration: 'underline' }}>
                &lt;-- Kembali
            </Link>

            <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                <img
                    src="/logo oc meme.jpg"
                    alt="Logo Divisi Meme"
                    style={{ width: '150px', height: '150px', borderRadius: '50%', border: '1px solid black' }}
                />
                <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Divisi Meme OurCreativity</h1>
                <p style={{ fontStyle: 'italic', color: '#555' }}>Divisi Konten Humor & Kreatif</p>
            </div>

            <hr />

            <section style={{ marginTop: '20px' }}>
                <h2>Tentang Divisi Meme</h2>
                <p>
                    Divisi Meme bertanggung jawab untuk membuat konten humor dan kreatif untuk media sosial OurCreativity.
                    Fokus kami adalah menghasilkan konten visual yang menarik dan relevan dengan audiens kami.
                </p>
            </section>

            <section style={{ marginTop: '20px' }}>
                <h2>Kegiatan</h2>
                <ul>
                    <li>Produksi konten untuk Instagram dan TikTok.</li>
                    <li>Kolaborasi dengan divisi lain untuk konten kreatif.</li>
                    <li>Riset tren konten terkini.</li>
                    <li>Pengelolaan arsip konten digital.</li>
                </ul>
            </section>

            <section style={{ marginTop: '20px' }}>
                <h2>Kontak</h2>
                <p>
                    Instagram:
                    <br />
                    <a
                        href="https://www.instagram.com/ocedisimeme.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', fontWeight: 'bold' }}
                    >
                        @ocedisimeme.id
                    </a>
                </p>
            </section>

            <hr style={{ marginTop: '50px' }} />

            <footer style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                <p>© 2025 OurCreativity Meme Division.</p>
            </footer>
        </div>
    );
};
