import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

// Shared metadata block
function MetaBlock({ title, artist, year, description, medium, editionType, price, align = 'left' }) {
  const isRight = align === 'right';
  return (
    <div className={`flex flex-col ${isRight ? 'items-end text-right' : 'items-start text-left'} z-20 max-w-[380px]`}>
      <h4 className={`text-3xl md:text-4xl font-display font-light tracking-wide text-white mb-2 transform ${isRight ? 'translate-x-4' : '-translate-x-4'} group-hover:translate-x-0 transition-transform duration-1000 ease-out`}>
        {title}
      </h4>
      <p className={`text-xs tracking-widest uppercase text-white/50 mb-4 transform ${isRight ? 'translate-x-2' : '-translate-x-2'} group-hover:translate-x-0 transition-transform duration-1000 delay-75 ease-out`}>
        {artist?.name || 'Unknown Artist'}{year && <span className="opacity-40"> — {year}</span>}
      </p>

      {description && (
        <p className={`text-sm font-light leading-relaxed text-white/35 mb-7 transform ${isRight ? 'translate-x-2' : '-translate-x-2'} group-hover:translate-x-0 transition-transform duration-1000 delay-100 ease-out`}>
          {description}
        </p>
      )}

      {/* Hover Reveal Tags */}
      <div className={`opacity-0 group-hover:opacity-100 transform ${isRight ? 'translate-x-4' : '-translate-x-4'} group-hover:translate-x-0 transition-all duration-1000 delay-150 ease-out flex flex-col ${isRight ? 'items-end' : 'items-start'} gap-3 text-[10px] tracking-widest uppercase text-white/50`}>
        {[medium, editionType, price].filter(Boolean).map((val, i) => (
          <div key={i} className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
            <span className="w-5 h-[1px] bg-white/25 shrink-0" />
            <span>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Portrait layout: tall image on left, metadata vertically centered on right
function PortraitExhibit({ artwork }) {
  const { id, title, medium, price, images, editionType, artist, description, year } = artwork;
  return (
    <div className="flex flex-row items-center gap-16 md:gap-28 w-full">
      {/* Image — left, rigidly 3:4 portrait */}
      <div className="flex-1 flex justify-end">
        <Link
          to={`/artwork/${id}`}
          className="block relative shrink-0 cursor-pointer rounded-sm"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div className="absolute inset-[-20px] bg-white opacity-0 group-hover:opacity-[0.03] blur-2xl transition-opacity duration-[2000ms] pointer-events-none" />
          <motion.div
            className="relative overflow-hidden bg-[#0a0a0a] rounded-sm"
            whileHover={{ scale: 1.03, y: -8 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={images[0]}
              alt={title}
              className="w-full h-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </Link>
      </div>

      {/* Metadata — right */}
      <div className="flex-1 flex justify-start">
        <MetaBlock title={title} artist={artist} year={year} description={description} medium={medium} editionType={editionType} price={price} align="left" />
      </div>
    </div>
  );
}

// Landscape layout: wide image top-spanning, metadata below-right as editorial caption
function LandscapeExhibit({ artwork }) {
  const { id, title, medium, price, images, editionType, artist, description, year } = artwork;
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Wide image — full width with 16:7 cinematic ratio */}
      <Link
        to={`/artwork/${id}`}
        className="block relative w-full cursor-pointer overflow-hidden rounded-sm"
        style={{ aspectRatio: '16 / 7' }}
      >
        <div className="absolute inset-[-20px] bg-white opacity-0 group-hover:opacity-[0.03] blur-2xl transition-opacity duration-[2000ms] pointer-events-none" />
        <motion.div
          className="absolute inset-0 overflow-hidden bg-[#0a0a0a]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Title overlay inside image bottom-left */}
          <div className="absolute bottom-6 left-8 pointer-events-none">
            <h4 className="text-2xl md:text-3xl font-display font-light tracking-wide text-white drop-shadow-lg">
              {title}
            </h4>
            <p className="text-xs tracking-widest uppercase text-white/60 mt-1">
              {artist?.name || 'Unknown Artist'}{year && <span className="opacity-50"> — {year}</span>}
            </p>
          </div>
        </motion.div>
      </Link>

      {/* Metadata strip below image — right aligned */}
      <div className="flex justify-end pr-2">
        <div className="flex flex-col items-end text-right max-w-[500px]">
          {description && (
            <p className="text-sm font-light leading-relaxed text-white/35 mb-5 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-1000 delay-100 ease-out">
              {description}
            </p>
          )}
          {/* Tags */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-150 flex flex-row gap-8 text-[10px] tracking-widest uppercase text-white/50">
            {[medium, editionType, price].filter(Boolean).map((val, i) => (
              <span key={i}>{val}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryExhibit({ artwork, index }) {
  const ref = useRef(null);
  const isLandscape = artwork.orientation === 'landscape';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className="relative group w-full"
      initial={{ filter: 'blur(12px)' }}
      whileInView={{ filter: 'blur(0px)' }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {isLandscape ? (
        <LandscapeExhibit artwork={artwork} />
      ) : (
        <PortraitExhibit artwork={artwork} />
      )}
    </motion.div>
  );
}
