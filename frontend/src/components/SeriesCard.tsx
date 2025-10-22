import svgPaths from "../imports/svg-t2f7wjh7pn";
import svgPathsCompleted from "../imports/svg-k8lz78timb";

interface SeriesCardProps {
  seriesNumber: number;
  repetitions: string;
  weight: string;
  restTime?: string;
  status: "active" | "pending" | "completed";
  onStart?: () => void;
  onRepetitionsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
  onRestTimeChange?: (value: string) => void;
}

export function SeriesCard({
  seriesNumber,
  repetitions,
  weight,
  restTime = "90",
  status,
  onStart,
  onRepetitionsChange,
  onWeightChange,
  onRestTimeChange,
}: SeriesCardProps) {
  // Estados completados (verde)
  if (status === "completed") {
    return (
      <div className="bg-[#6d9f28] h-[35px] relative rounded-[28px] shrink-0 w-full">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] h-[35px] items-center justify-center px-[13px] py-[5px] relative w-full">
            <div className="content-stretch flex gap-[51px] items-center relative shrink-0">
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#345408] text-[14px] w-[10px]">
                  {seriesNumber}
                </p>
                <div
                  className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                  style={
                    {
                      "--transform-inner-width": "24",
                      "--transform-inner-height": "0",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex-none rotate-[90deg]">
                    <div className="h-0 relative w-[24px]">
                      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 1"
                        >
                          <line
                            id="Line 4"
                            stroke="#43690F"
                            strokeLinecap="round"
                            x1="0.5"
                            x2="23.5"
                            y1="0.5"
                            y2="0.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.73)] w-[101px]">
                  {repetitions} repetições
                </p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                  <div className="absolute inset-[-7.5%_-4.41%]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 19 12"
                    >
                      <path
                        d={svgPathsCompleted.p1aa92980}
                        id="Vector"
                        stroke="#43690F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.73)] w-[29px]">
                  {weight}kg
                </p>
              </div>
              <div className="relative shrink-0 size-[20px]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d={svgPathsCompleted.p2a2a4900}
                    fill="#43690F"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estados pendentes (cinza simples)
  if (status === "pending") {
    return (
      <div className="bg-[#202020] h-[35px] relative rounded-[28px] shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] h-[35px] items-start px-[26px] py-[5px] relative w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-[296px]">
              <div className="content-stretch flex gap-[23px] items-center relative shrink-0">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-[17px]">
                  <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white w-[10px]">
                    {seriesNumber}
                  </p>
                  <div
                    className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                    style={
                      {
                        "--transform-inner-width": "24",
                        "--transform-inner-height": "0",
                      } as React.CSSProperties
                    }
                  >
                    <div className="flex-none rotate-[90deg]">
                      <div className="h-0 relative w-[24px]">
                        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                          <svg
                            className="block size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 24 1"
                          >
                            <line
                              id="Line 4"
                              stroke="#484848"
                              strokeLinecap="round"
                              x1="0.5"
                              x2="23.5"
                              y1="0.5"
                              y2="0.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={`${repetitions} repetições`}
                  onChange={(e) => {
                    const val = e.target.value.replace(' repetições', '');
                    onRepetitionsChange?.(val);
                  }}
                  className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] w-[101px] bg-transparent border-none outline-none p-0"
                />
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                  <div className="absolute inset-[-7.5%_-4.41%]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 19 12"
                    >
                      <path
                        d={svgPaths.p1aa92980}
                        id="Vector"
                        stroke="#484848"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={`${weight}kg`}
                  onChange={(e) => {
                    const val = e.target.value.replace('kg', '');
                    onWeightChange?.(val);
                  }}
                  className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] w-[29px] bg-transparent border-none outline-none p-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado ativo (primeira série com botão)
  return (
    <div className="bg-[#202020] h-[80px] relative rounded-[28px] shrink-0 w-full">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[13px] h-[80px] items-center p-[9px] relative w-full">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-[296px]">
            <div className="content-stretch flex gap-[23px] items-center relative shrink-0">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-[17px]">
                <p className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white w-[6px]">
                  {seriesNumber}
                </p>
                <div
                  className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                  style={
                    {
                      "--transform-inner-width": "24",
                      "--transform-inner-height": "0",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex-none rotate-[90deg]">
                    <div className="h-0 relative w-[24px]">
                      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 1"
                        >
                          <line
                            id="Line 4"
                            stroke="#484848"
                            strokeLinecap="round"
                            x1="0.5"
                            x2="23.5"
                            y1="0.5"
                            y2="0.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <input 
                type="text" 
                value={`${repetitions} repetições`}
                onChange={(e) => {
                  const val = e.target.value.replace(' repetições', '');
                  onRepetitionsChange?.(val);
                }}
                className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] w-[101px] bg-transparent border-none outline-none p-0"
              />
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
              <div className="h-[10px] relative shrink-0 w-[17px]" data-name="Vector">
                <div className="absolute inset-[-7.5%_-4.41%]">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 19 12"
                  >
                    <path
                      d={svgPaths.p1aa92980}
                      id="Vector"
                      stroke="#484848"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
              <input 
                type="text" 
                value={`${weight}kg`}
                onChange={(e) => {
                  const val = e.target.value.replace('kg', '');
                  onWeightChange?.(val);
                }}
                className="font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-[rgba(187,187,187,0.73)] w-[29px] bg-transparent border-none outline-none p-0"
              />
            </div>
          </div>
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
            <button
              onClick={onStart}
              className="bg-[#d9d9d9] box-border content-stretch flex flex-col gap-[10px] h-[24px] items-start px-[63px] py-[4px] relative rounded-[999px] shrink-0 w-[180px] cursor-pointer hover:bg-[#e5e5e5] transition-colors"
            >
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <p className="[grid-area:1_/_1] font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] ml-[15px] mt-0 relative text-[12px] text-black text-nowrap whitespace-pre">
                  iniciar
                </p>
                <div className="[grid-area:1_/_1] aspect-[15.0005/18.0006] ml-0 mt-[2px] relative w-[10px]" data-name="Vector">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 10 12"
                  >
                    <path d={svgPaths.p3b7e4cf0} fill="black" id="Vector" />
                  </svg>
                </div>
              </div>
            </button>
            <div className="bg-[#252525] box-border content-stretch flex flex-col gap-[10px] h-[24px] items-start px-[20px] py-[6px] relative rounded-[999px] shrink-0 w-[119px]">
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <input 
                  type="text" 
                  value={`${restTime} segundos`}
                  onChange={(e) => {
                    const val = e.target.value.replace(' segundos', '');
                    onRestTimeChange?.(val);
                  }}
                  className="[grid-area:1_/_1] font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] ml-[15px] mt-0 relative text-[#484848] text-[10px] text-nowrap whitespace-pre bg-transparent border-none outline-none p-0"
                />
                <div className="[grid-area:1_/_1] aspect-[18/18] ml-0 mt-px relative w-[10px]" data-name="Vector">
                  <div className="absolute inset-[-7.5%]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d={svgPaths.p2eb65600}
                        id="Vector"
                        stroke="#484848"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
