import React from 'react';


const MushafCard = ({ ayahs }:{ ayahs:any }) => {
  // const { arabicFontSize } = useSelector((state:any) => state.settings);
  return (
    <>
      <h1 className='flex text-justify break-word flex-row-reverse items-center flex-wrap word-spacing text-gray-800 dark:text-gray-300 font-noorehuda text-5xl py-5 leading-relaxed transition-colors duration-500'>
      {ayahs?.map((ayah:any) => (
        <span
          key={ayah.id}
          style={{ direction: 'rtl', fontSize: '22px'}}
          

        >
          {ayah?.text}
          <span >{'('+ayah?.id+'). '}</span>
        </span>
      ))}
    </h1>
    </>
  );
};

export default MushafCard;


