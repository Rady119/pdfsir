'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function BlogImage({ src, alt, caption }: BlogImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <Image
          src={src}
          alt={alt}
          fill
          className={`
            object-cover
            duration-700 ease-in-out
            ${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}