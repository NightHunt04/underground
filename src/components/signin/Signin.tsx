import React, { useState } from 'react'
import { useAppContext } from '../../context/ContextProvider'
import ReCAPTCHA from 'react-google-recaptcha'
import { useNavigate } from 'react-router-dom'
import './style.css'

interface Branches {
    Engineering: string[]
    Bachelors: string[]
    Medical: string[]
}

export default function Signin(): React.ReactElement {
    const navigate = useNavigate()
    const context = useAppContext()
    const [selectRole, setSelectRole] = useState<boolean>(false)
    const [selectField, setSelectField] = useState<boolean>(false)
    const [selectBatch, setSelectBatch] = useState<boolean>(false)
    const [showCap, setShowCap] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    // const [capVal, setCapVal] = useState<string>('')

    const BRANCHES: Branches = {
        Engineering: ['CE', 'CSE', 'IT', 'ITE', 'ML/AI'],
        Bachelors: ['IT'],
        Medical: ['Physiotherapy']
    }

    const handleSelectRole = (): void => {
        setSelectRole(prev => !prev)
    }

    const handleCaptcha = (value: string): void => {
        console.log(value)

        // backend logic for auth


        navigate('/student/ajknf93u2j4i')
    }

    const handleSingin = (): void => {
        if (email && password && context?.selectedRole !== 'Select Role') {
            setLoader(true)
            setShowCap(true)
        }
    }

    return (
        <div className='flex items-start justify-center mt-32 w-full gap-10'>
            <div className='flex flex-col items-start justify-start p-3 md:p-5 drop-shadow-lg bg-white w-[60%] md:w-[30%] rounded-lg'>
                <h2 className='font-semibold text-xl md:text-2xl pb-2 border-b-[1px] w-full border-gray-300'>Signin</h2>

                <div onClick={handleSelectRole} className='relative p-2 bg-[#f3f3f3] rounded-md w-full hover:cursor-pointer hover:bg-[#e9e9e9] transition-all flex items-center justify-center mt-5'>
                    <p className='text-md md:text-lg text-gray-700 font-medium'>{String(context?.selectedRole)} &nbsp;<span><i className={`fa-solid ${selectRole ? 'fa-caret-up' : 'fa-caret-down' }`}></i></span></p>
                    {context?.selectedRole !== 'Select Role' && <img src='/assets/r.png' className='w-[15px] h-[15px] object-cover absolute right-4' />}
                </div>

                {selectRole && 
                    <div className='rounded-md p-1 border-[1px] border-gray-300 w-full transition-all flex flex-col items-start justify-center mt-2'>
                        <p onClick={() => {
                            context?.setSelectedRole('Student')
                            setSelectRole(false)
                        }} className='w-full py-3 text-center rounded-md bg-[#f4f4f4] hover:cursor-pointer hover:bg-[#e9e9e9] transition-all'>Student</p>
                        <p onClick={() => {
                            context?.setSelectedRole('Professor')
                            setSelectRole(false)
                        }} className='w-full py-3 text-center rounded-md bg-[#f4f4f4] mt-1 hover:cursor-pointer hover:bg-[#e9e9e9] transition-all'>Professor</p>
                    </div>}

                {context?.selectedRole === 'Student' && 
                    <div onClick={() => setSelectField(prev => !prev)} className='relative p-2 bg-[#f3f3f3] rounded-md w-full hover:cursor-pointer hover:bg-[#e9e9e9] transition-all flex items-start justify-center mt-3'>
                        <p className='text-md md:text-lg font-medium text-gray-700'>{String(context?.field)} &nbsp;<span><i className={`fa-solid ${selectField ? 'fa-caret-up' : 'fa-caret-down' }`}></i></span></p>
                        {context?.field !== 'Select Field' && <img src='/assets/r.png' className='w-[15px] h-[15px] object-cover absolute right-4' />}
                    </div>}

                {selectField &&
                    <div className='rounded-md p-1 border-[1px] border-gray-300 w-full transition-all flex flex-col items-start justify-center mt-2'>
                        {Object.keys(BRANCHES).map((branch, index: number) => {
                            return (
                                <p key={index} onClick={() => {
                                    context?.setField(branch)
                                    setSelectField(false)
                                }} className='text-gray-700 hover:cursor-pointer hover:bg-[#e0e0e0] p-1 m-1 rounded-md bg-[#efefef] text-center w-full'>{branch}</p>
                            )
                        })}
                    </div>}

                {context?.selectedRole === 'Student' &&
                    <div onClick={() => setSelectBatch(prev => !prev)} className='relative p-2 bg-[#f3f3f3] rounded-md w-full hover:cursor-pointer hover:bg-[#e9e9e9] transition-all flex items-start justify-center mt-3'>
                        <p className='text-md md:text-lg font-medium text-gray-700'>{String(context?.batch)} &nbsp;<span><i className={`fa-solid ${selectBatch ? 'fa-caret-up' : 'fa-caret-down' }`}></i></span></p>
                        {context?.batch !== 'Select Batch' && <img src='/assets/r.png' className='w-[15px] h-[15px] object-cover absolute right-4' />}
                    </div>}

                {selectBatch && 
                    <div className='rounded-md p-1 border-[1px] border-gray-300 w-full transition-all flex flex-col items-start justify-center mt-2'>
                        {BRANCHES[context.field].map((batch: string, index: number) => {
                            return (
                                <p key={index} onClick={() => {
                                    context?.setBatch(batch)
                                    setSelectBatch(false)
                                }} className='text-gray-700 hover:cursor-pointer hover:bg-[#e0e0e0] p-1 m-1 rounded-md bg-[#efefef] text-center w-full'>{batch}</p>
                            )
                        })}                    
                    </div>}
                    
                <p className='mt-3 text-gray-600'>Enter the below credentials to continue</p>

                <div className="flex flex-col relative items-center justify-center mt-8 w-full">
                    <input 
                        id="email"
                        type="email" 
                        placeholder="Your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && document.getElementById('password')!.focus()}
                        className="peer outline-none border-[1px] border-[#ddd] rounded-lg px-4 py-2 w-full placeholder-transparent focus:border-[#4d86d0]"
                        />
                    <label htmlFor="email" className="absolute text-[13px] text-[#646464] px-1 left-3 -top-[17px] peer-placeholder-shown:text-[13px] 2xl:peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-2 transition-all duration-300">Email</label>
                </div>

                <div className="flex flex-col relative items-center justify-center mt-8 w-full">
                    <input 
                        id="password"
                        type="password" 
                        placeholder="Your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        // onKeyDown={e => e.key === 'Enter' && document.getElementById('createRoom').focus()}
                        className="peer outline-none border-[1px] border-[#ddd] rounded-lg px-4 py-2 w-full placeholder-transparent focus:border-[#4d86d0]"
                        />
                    <label htmlFor="password" className="absolute text-[13px] text-[#646464] px-1 left-3 -top-[17px] peer-placeholder-shown:text-[13px] 2xl:peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-2 transition-all duration-300">Password</label>
                </div>

                <button onClick={handleSingin} className='flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold w-full text-center rounded-md mt-5'>
                    {loader ?
                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>                        
                        :<p>Signin</p>}
                </button>

                {showCap && <div className='mt-10 w-full flex flex-col items-center justify-center'>
                    <p className='mb-2 text-gray-500'>Verify you are a human to continue</p>
                    <ReCAPTCHA sitekey='6LdXXS4qAAAAAGZnNHfloxMkOKrIuiapeJYHBuci' onChange={handleCaptcha} />
                </div>}
            </div>
        </div>
    )
}