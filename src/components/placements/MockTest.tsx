export default function MockTest() {
  return (
    <div className="mt-5 w-[80%] rounded-lg flex flex-col gap-5 items-start justify-start">
        <div className="flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
                <p className='text-lg md:text-xl'>Select the type of test you would like to have</p>
            </div>
        </div>
    </div>
  )
}
