
import React, { useState } from 'react'
import { createClient } from "@supabase/supabase-js"
import BlurImage from '../components/BlurImage'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
)

const updateDB = async ({ name, href, username}: DBEntry ) => {

  const { data, error } = await supabaseAdmin
  .from('images')
  .insert([
    {
      name: name,
      href: href,
      username: username,
    }
  ])
}

export const getStaticProps = async () => {
  const { data } = await supabaseAdmin
  .from('images')
  .select('*')
  .order('id');

  return {
    props: {
      images: data,
    },
  }

}

const Gallery = ({ images }: { images: Image[] }) => {
  const [data, setData] = useState({
    name: '',
    href: '',
    username: '',
  })

  const handleUpload = async () => {
    console.log(data)
    updateDB(data)
  }

  return (
    <div className='flex flex-row space-between flex-wrap md:flex-nowrap max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='w-full md:w-[70%] grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
        {images.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
      <div className='flex flex-col w-full md:w-[30%] ml-3'>
        <input className='bg-gray-200 px-4 py-2 text-md rounded-t-md' onChange={e => setData({...data, name: e.target.value})} value={data.name} placeholder="name"></input>
        <input className='bg-gray-200 px-4 py-2 text-md' onChange={e => setData({...data, href: e.target.value})} value={data.href} placeholder="link"></input>
        <input className='bg-gray-200 px-4 py-2 text-md' onChange={e => setData({...data, username: e.target.value})} value={data.username} placeholder="username"></input>
        <button className='bg-green-300 px-4 py-2 text-md uppercase rounded-b-md' onClick={handleUpload}>UPLOAD</button>
      </div>
    </div>
  )
}

export default Gallery