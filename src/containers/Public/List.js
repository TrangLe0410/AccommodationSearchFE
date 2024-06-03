import React, { useEffect, useState } from 'react'
import { Button, Item } from '../../components'
import { getPosts, getPostsLimit } from '../../store/actions/post'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
const List = ({ categoryCode }) => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const { posts } = useSelector(state => state.post)
    const [sort, setSort] = useState(0)
    useEffect(() => {
        let params = []
        for (let entry of searchParams.entries()) {
            params.push(entry);
        }
        let searchParamsObject = {}
        params?.forEach(i => {
            if (Object.keys(searchParamsObject)?.some(item => item === i[0])) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]]
            } else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] }
            }
        })
        if (categoryCode) searchParamsObject.categoryCode = categoryCode
        if (sort === 1) searchParamsObject.order = ['createdAt', 'DESC']
        dispatch(getPostsLimit(searchParamsObject))
    }, [searchParams, categoryCode, sort])
    // useEffect(() => {
    //     dispatch(getPosts())
    // })

    return (
        <div className='w-full bg-white shadow-sm rounded-md border border-gray-300 p-6 items-start'>
            <div className='flex items-center justify-between'>
                <h4 className='text-3xl text-[#0E2E50] font-semibold'> Danh sách bài đăng</h4>
                <div className='flex items-center gap-2 my-2'>
                    <div className='flex items-center gap-2 my-2'>
                        <span
                            onClick={() => setSort(0)}
                            className={`border p-2 rounded-md cursor-pointer ${sort === 0 ? 'bg-[#00B98E] border-[#00B98E] text-white' : 'bg-white border-[#00B98E] text-[#0e2e50] hover:bg-[#00B98E] hover:text-white'}`}
                        >
                            Mặc định
                        </span>
                        <span
                            onClick={() => setSort(1)}
                            className={`border p-2 rounded-md cursor-pointer ${sort === 1 ? 'bg-[#00B98E] border-[#00B98E] text-white' : 'bg-white border-[#00B98E] text-[#0e2e50] hover:bg-[#00B98E] hover:text-white'}`}
                        >
                            Mới nhất
                        </span>
                    </div>


                </div>

            </div>

            <div className='items mt-6'>
                {posts?.length > 0 && posts
                    .filter(item => item.status === 'Approved' && item.visibility === 'Visible') // Lọc ra những bài đăng có status là "Approved"
                    .map(item => (
                        <Item
                            key={item?.id}
                            address={item?.address}
                            attributes={item?.attributes}
                            description={JSON.parse(item?.description)}
                            images={JSON.parse(item?.images?.image)}
                            star={+item?.star}
                            title={item?.title}
                            user={item?.user}
                            id={item?.id}
                        />
                    ))}
            </div>

        </div>
    )
}

export default List