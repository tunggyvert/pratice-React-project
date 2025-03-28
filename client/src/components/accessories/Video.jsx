import React from 'react'

const Video = () => {
  return (
    <div className='relative pb-[56.25%] h-0 overflow-hidden '>
        <iframe 
        className='w-[640px] h-[640px]'
        src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fgroverescidences%2Fvideos%2F1479481122408880%2F&show_text=false&width=560&t=0" 
        frameborder="0"  
        allow="autoplay; clipboard-write; fullscreen; encrypted-media; picture-in-picture; web-share" 
        >
        </iframe>    
    </div>
  )
}

export default Video