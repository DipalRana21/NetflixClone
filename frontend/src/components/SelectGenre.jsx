import React from 'react'
import { useDispatch } from 'react-redux'
import { fetchDataByGenre } from '../store';

const SelectGenre = ({ genres, type }) => {

    const dispatch=useDispatch();

    return (
        <select className='mt-5 ml-20 cursor-pointer text-base bg-black/40 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50'
        onChange={(e)=>{
            dispatch(fetchDataByGenre({genre: e.target.value, type}))

        }}>
            {
                genres.map((genre) => {
                    return <option value={genre.id} key={genre.id}>{genre.name}</option>
                })
            }
        </select>
    )
}

export default SelectGenre