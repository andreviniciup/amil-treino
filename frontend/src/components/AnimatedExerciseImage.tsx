import { useState, useEffect } from 'react';

interface AnimatedExerciseImageProps {
  gifUrl: string;
  alt: string;
  className?: string;
  transitionSpeed?: number; // em milissegundos
}

export function AnimatedExerciseImage({ 
  gifUrl, 
  alt, 
  className = '',
  transitionSpeed = 1000 // 1 segundo por padrão
}: AnimatedExerciseImageProps) {
  const [currentImage, setCurrentImage] = useState<0 | 1>(0);
  const [imageError, setImageError] = useState(false);

  // Derivar URLs das duas imagens (0.jpg e 1.jpg)
  const getImageUrl = (index: 0 | 1) => {
    if (!gifUrl) return '';
    // Substitui o número no final (0.jpg ou 1.jpg)
    return gifUrl.replace(/[0-1]\.jpg$/, `${index}.jpg`);
  };

  const image0Url = getImageUrl(0);
  const image1Url = getImageUrl(1);

  // Alternar entre as imagens
  useEffect(() => {
    if (imageError || !gifUrl) return;

    const interval = setInterval(() => {
      setCurrentImage(prev => prev === 0 ? 1 : 0);
    }, transitionSpeed);

    return () => clearInterval(interval);
  }, [gifUrl, transitionSpeed, imageError]);

  // Pré-carregar ambas as imagens
  useEffect(() => {
    if (!gifUrl) return;

    const img0 = new Image();
    const img1 = new Image();

    img0.src = image0Url;
    img1.src = image1Url;

    img0.onerror = () => setImageError(true);
    img1.onerror = () => setImageError(true);
  }, [image0Url, image1Url, gifUrl]);

  if (imageError || !gifUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#2a2a2a] ${className}`}>
        <p className="text-gray-400 text-sm">Imagem não disponível</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Imagem 0 */}
      <img
        src={image0Url}
        alt={`${alt} - posição inicial`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          currentImage === 0 ? 'opacity-100' : 'opacity-0'
        }`}
        onError={() => setImageError(true)}
      />
      
      {/* Imagem 1 */}
      <img
        src={image1Url}
        alt={`${alt} - posição final`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          currentImage === 1 ? 'opacity-100' : 'opacity-0'
        }`}
        onError={() => setImageError(true)}
      />

      {/* Placeholder invisível para manter proporções */}
      <img
        src={image0Url}
        alt=""
        className="w-full h-full object-cover opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
