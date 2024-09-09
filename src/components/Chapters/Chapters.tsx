import React from 'react';
import chaptersList from '../../data/chaptersList';
import ChaptersCard from '../Cards/ChaptersCard';

const Chapters = () => {
  return (
    <div className='grid gap-2 grid-flow-row-dense xl:grid-cols-6 md:grid-cols-4 grid-rows-37' >
      {chaptersList.map(chapter => (
        <ChaptersCard key={chapter.id} {...chapter} />
      ))}
    </div>
  );
};

export default Chapters;
