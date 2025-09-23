import React from 'react'

const Title = ({title,desc}) => {
  return (
    <div className='flex flex-col items-center gap-2'>
        <h2 className='text-3xl sm:text-5xl font-medium text-center'>{title}</h2>
        <p className='max-w-lg text-center text-gray-500 mt-5 font-regular'>{desc}</p>
    </div>
  )
}

export default Title