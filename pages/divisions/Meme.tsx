import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Meme = () => {
    const [blink, setBlink] = useState(true);
    const [color, setColor] = useState('red');

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(prev => !prev);
            setColor(prev => prev === 'red' ? 'blue' : prev === 'blue' ? 'green' : 'red');
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[url('https://media.giphy.com/media/26tOzqUqRk2s0gT6M/giphy.gif')] text-black font-sans overflow-x-hidden pt-28">

            {/* MARQUEE ATAS */}
            <div className="bg-yellow-300 border-b-4 border-red-600 p-1">
                {/* @ts-ignore */}
                <marquee scrollamount="15" className="text-2xl font-bold text-red-600 font-[Comic_Sans_MS]">
                    SELAMAT DATANG DI WEBSITE TERBURUK DI DUNIA!!! DIVISI MEME OURCREATIVITIES MEMPERSEMBAHKAN KEKACAUAN DIGITAL INI!!! JANGAN LUPA SUBSCRIBE!!! KLIK IKLAN DI BAWAH!!!
                    {/* @ts-ignore */}
                </marquee>
            </div>

            <div className="flex flex-wrap md:flex-nowrap">

                {/* SIDEBAR KIRI (KEKACAUAN) */}
                <div className="w-full md:w-1/4 bg-cyan-300 p-2 border-r-8 border-double border-purple-600">
                    <div className="bg-white border-4 border-black p-2 mb-4 text-center">
                        <h3 className="font-bold text-red-600 blink">MENU UTAMA</h3>
                        <ul className="list-disc list-inside text-blue-800 underline">
                            <li><Link to="/">KEMBALI KE MASA DEPAN</Link></li>
                            <li><a href="#">DOWNLOAD RAM GRATIS</a></li>
                            <li><a href="#">CARA CEPAT KAYA</a></li>
                            <li><a href="#">RAHASIA ILLUMINATI</a></li>
                            <li><a href="#">RESEP INDOMIE</a></li>
                        </ul>
                    </div>

                    <div className="bg-pink-400 p-2 mb-4 text-center animate-pulse">
                        <h3 className="text-xl font-black text-yellow-200 bg-black">IKLAN BARIS</h3>
                        <p className="text-xs font-mono bg-white mt-2">DIJUAL: MOTOR SUPRA BAPACK, MINUS STNK HILANG, PAJAK MATI 10 TAHUN. HUBUNGI ADMIN.</p>
                    </div>

                    <img src="https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" alt="Dancing Baby" className="mx-auto w-24" />
                    <div className="text-center font-mono text-xs mt-2 bg-white border border-black">
                        PENGUNJUNG KE: <span className="text-red-600 font-bold">999999</span>
                    </div>
                </div>

                {/* KONTEN UTAMA (KELEBIHAN INFORMASI) */}
                <div className="w-full md:w-1/2 bg-white p-4 border-r-8 border-dotted border-green-600 relative">
                    {/* GIF MENGAMBANG */}
                    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" className="absolute top-0 right-0 w-20 z-10" />
                    <img src="https://media.giphy.com/media/Kx82Lvb7wcYNO/giphy.gif" className="absolute bottom-10 left-0 w-24 z-10" />

                    <div className="text-center mb-8">
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-bounce" style={{ fontFamily: 'Impact' }}>
                            DIVISI MEME
                        </h1>
                        <h2 className={"text-2xl font-bold bg-black text-white inline-block px-4 " + (blink ? 'opacity-100' : 'opacity-0')}>
                            THE OFFICIAL HOMEPAGE
                        </h2>
                    </div>

                    <div className="bg-yellow-100 border-4 border-red-500 p-4 mb-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-xl font-bold text-blue-700 underline mb-2" style={{ fontFamily: 'Times New Roman' }}>TENTANG KAMI (BACA DENGAN TELITI!!!)</h3>
                        <p className="text-sm font-serif leading-tight text-justify mb-4">
                            <span className="text-4xl float-left font-black text-red-600 mr-2">K</span>
                            ami adalah entitas digital yang bergerak di bidang produksi konten humor berbasis internet (MEME) yang bertujuan untuk menghibur, menyindir, dan kadang-kadang membuat orang tersinggung (tapi bercanda). Didirikan pada tahun 202X ketika internet masih belum secepat sekarang (bohong), kami berdedikasi untuk melestarikan budaya "shitposting" yang luhur dan bermartabat. Visi kami adalah menjadikan dunia tempat yang lebih lucu, satu gambar pecah pada satu waktu. Misi kami? Tidak jelas, yang penting upload.
                        </p>
                        <p className="text-sm font-serif leading-tight text-justify bg-green-200 p-2">
                            <strong>PERINGATAN:</strong> Konten yang kami buat mungkin mengandung unsur sarkasme tingkat tinggi, humor bapak-bapak, dan referensi pop culture yang hanya dimengerti oleh 3 orang di kantor kami. Kami tidak bertanggung jawab atas kerusakan otak atau hilangnya selera humor setelah mengunjungi halaman ini.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-blue-200 p-2 border-2 border-blue-800">
                            <h4 className="font-bold text-center bg-blue-800 text-white">VISI KAMI</h4>
                            <ul className="list-square list-inside text-xs mt-2">
                                <li>Menjadi raja meme lokal.</li>
                                <li>Mengalahkan algoritma.</li>
                                <li>Dapet centang biru (mimpi).</li>
                            </ul>
                        </div>
                        <div className="bg-red-200 p-2 border-2 border-red-800">
                            <h4 className="font-bold text-center bg-red-800 text-white">MISI KAMI</h4>
                            <ul className="list-disc list-inside text-xs mt-2">
                                <li>Upload tiap hari (kalo ga lupa).</li>
                                <li>Bikin admin lain iri.</li>
                                <li>Tidur yang cukup.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-purple-200 border-4 border-dashed border-purple-800 p-4 text-center">
                        <h3 className="text-2xl font-black text-purple-900 mb-2" style={{ fontFamily: 'Comic Sans MS' }}>GALERI KEBANGGAAN</h3>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <img src="https://media.giphy.com/media/3o7TKSjRrfIPjeiByQ/giphy.gif" className="w-24 h-24 border-4 border-white" />
                            <img src="https://media.giphy.com/media/l0HlHJGHe3yAMjfFK/giphy.gif" className="w-24 h-24 border-4 border-white" />
                            <img src="https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif" className="w-24 h-24 border-4 border-white" />
                        </div>
                        {/* @ts-ignore */}
                        <marquee scrollamount="5" direction="right" className="text-xs font-mono mt-2 bg-white">
                            GAMBAR-GAMBAR INI ADALAH ASET BERHARGA PERUSAHAAN. DILARANG MENCURI!!!
                            {/* @ts-ignore */}
                        </marquee>
                    </div>
                </div>

                {/* SIDEBAR KANAN (LEBIH BANYAK KEKACAUAN) */}
                <div className="w-full md:w-1/4 bg-lime-300 p-2 border-l-8 border-groove border-orange-600">
                    <div className="bg-black text-green-500 p-2 font-mono text-xs mb-4 overflow-hidden h-40">
                        <p>&gt; SYSTEM.INIT()</p>
                        <p>&gt; LOADING MEMES...</p>
                        <p>&gt; ERROR: 404 BRAIN NOT FOUND</p>
                        <p>&gt; RETRYING...</p>
                        <p>&gt; SUCCESS!</p>
                        <p className="animate-pulse">_</p>
                    </div>

                    <div className="bg-white border-4 border-red-600 p-2 text-center transform rotate-2">
                        <h3 className="font-black text-red-600 text-2xl">HOT NEWS!!!</h3>
                        <p className="text-xs leading-tight mt-2">
                            DIVISI MEME BARU SAJA MEMENANGKAN PENGHARGAAN "DIVISI PALING GABUT" TAHUN 2025 OLEH MAJALAH BOBO!!!
                        </p>
                        <button className="bg-blue-600 text-white font-bold px-4 py-2 mt-2 hover:bg-red-600 border-b-4 border-blue-800 active:border-0 active:translate-y-1">
                            BACA SELENGKAPNYA &gt;&gt;
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <h4 className="font-bold text-purple-700 bg-white inline-block px-2">PARTNER KAMI:</h4>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                            <div className="bg-white h-10 flex items-center justify-center text-[8px] border border-black">WARUNG KOPI</div>
                            <div className="bg-white h-10 flex items-center justify-center text-[8px] border border-black">TUKANG FOTOCOPY</div>
                            <div className="bg-white h-10 flex items-center justify-center text-[8px] border border-black">ANGKRINGAN 4.0</div>
                            <div className="bg-white h-10 flex items-center justify-center text-[8px] border border-black">JASA KETIK SKRIPSI</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MARQUEE FOOTER */}
            <div className="bg-black text-white p-2 border-t-4 border-white">
                {/* @ts-ignore */}
                <marquee scrollamount="20" direction="right" className="font-mono text-sm">
                    COPYRIGHT (C) 1990-2025 OURCREATIVITIES INC. ALL RIGHTS RESERVED. DESIGNED BY INTERN YANG DIBAYAR PAKE UCAPAN TERIMA KASIH. JANGAN LUPA MINUM AIR PUTIH.
                    {/* @ts-ignore */}
                </marquee>
            </div>
        </div>
    );
};
