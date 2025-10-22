function Frame498() {
  return (
    <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[#f4f4f4] text-nowrap w-full whitespace-pre">
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium relative shrink-0 text-[31px]">14</p>
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal relative shrink-0 text-[14px]">segundos</p>
    </div>
  );
}

function Frame488() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
    </div>
  );
}

function Frame489() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#fdcb1a] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
    </div>
  );
}

function Frame490() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
      <div className="bg-[#484848] rounded-[8px] shrink-0 size-[30px]" />
    </div>
  );
}

function Frame497() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame488 />
      <Frame489 />
      {[...Array(7).keys()].map((_, i) => (
        <Frame490 key={i} />
      ))}
    </div>
  );
}

function Frame354() {
  return (
    <div className="bg-[#a91717] box-border content-stretch flex gap-[10px] items-center justify-center px-[35px] py-[5px] relative rounded-[10px] shrink-0">
      <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#f4f4f4] text-[18px] text-nowrap whitespace-pre">Parar</p>
    </div>
  );
}

function Frame499() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19px] items-center left-[45px] top-[242px] w-[300px]">
      <Frame498 />
      <Frame497 />
      <Frame354 />
    </div>
  );
}

export default function TreinoTempoDescanso() {
  return (
    <div className="bg-[#181818] relative size-full" data-name="treino-tempo-descanso">
      <Frame499 />
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[calc(60%+36px)] text-[10px] text-nowrap text-white top-[44px] whitespace-pre">tempo de descanso</p>
    </div>
  );
}