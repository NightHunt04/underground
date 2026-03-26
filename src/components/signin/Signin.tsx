// @ts-nocheck

import React, { useState } from 'react'
import { useAppContext } from '../../context/ContextProvider'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import './style.css'
import { useCookies } from "react-cookie"

export default function Signin(): React.ReactElement {
    const navigate = useNavigate()
    const context = useAppContext()
    const [cookies, setCookie] = useCookies(['user'])

    const [loader, setLoader] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSignin = async (): Promise<void> => {
        if (!email || !password) {
            alert("Please fill all fields.")
            return
        }

        setLoader(true)

        try {
            const rolePayload = 'student'

            const payload = {
                email: email,
                role: rolePayload,
                password: password
            }

            const response = await authApi.signin(payload)

            context?.setIsLoggedIn(true)

            context?.setUser({
                id: response.user.id,
                email: response.user.email,
                role: response.user.role,
                branch: response.user.branch,
                enrollmentNumber: response.user.enrollmentNumber,
                semester: response.user.semester,
                name: response.user.name,
                field: response.user.field
            })

            setCookie('user', response.user, {
                path: '/',
                maxAge: 24 * 60 * 60,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            })

            navigate(`/student/${response.user.id}/subjects`)
        } catch (error: any) {
            console.error("Login Failed:", error)
            alert(error.message || "Invalid Credentials or Server Error")
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className='flex items-start justify-center mt-32 w-full gap-10'>
            <div className='flex flex-col items-start justify-start p-3 md:p-5 drop-shadow-lg bg-white w-[90%] md:w-[30%] rounded-lg'>
                <h2 className='font-semibold text-xl md:text-2xl pb-2 border-b-[1px] w-full border-gray-300'>
                    Student Signin
                </h2>

                <p className='mt-5 text-gray-600'>
                    Enter your credentials to continue
                </p>

                {/* EMAIL */}
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
                    <label htmlFor="email" className="absolute text-[13px] text-[#646464] px-1 left-3 -top-[17px] peer-placeholder-shown:top-2 transition-all duration-300">
                        Email
                    </label>
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col relative items-center justify-center mt-8 w-full">
                    <input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSignin()}
                        className="peer outline-none border-[1px] border-[#ddd] rounded-lg px-4 py-2 w-full placeholder-transparent focus:border-[#4d86d0]"
                    />
                    <label htmlFor="password" className="absolute text-[13px] text-[#646464] px-1 left-3 -top-[17px] peer-placeholder-shown:top-2 transition-all duration-300">
                        Password
                    </label>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleSignin}
                    disabled={loader}
                    className='flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold w-full text-center rounded-md mt-8 hover:bg-green-700 transition-colors disabled:opacity-60'
                >
                    {loader ? "Signing in..." : "Signin"}
                </button>
            </div>
        </div>
    )
}




















// // @ts-nocheck

// import React, { useState, useRef } from 'react'
// import { useAppContext } from '../../context/ContextProvider'
// import ReCAPTCHA from 'react-google-recaptcha'
// import { useNavigate } from 'react-router-dom'
// import { authApi } from '../../api/auth'
// import './style.css'
// import { useCookies } from "react-cookie"

// export default function Signin(): React.ReactElement {
//     const navigate = useNavigate()
//     const context = useAppContext()
//     const recaptchaRef = useRef<ReCAPTCHA>(null)
//     const [cookies, setCookie] = useCookies(['user'])

//     const [showCap, setShowCap] = useState<boolean>(false)
//     const [loader, setLoader] = useState<boolean>(false)
//     const [email, setEmail] = useState<string>('')
//     const [password, setPassword] = useState<string>('')

//     const handleCaptcha = async (value: string | null): void => {
//         if (!value) return; 
//         console.log("Captcha Verified:", value)

//         try {
//             // Hardcoded role for student-only frontend
//             const rolePayload = 'student'; 
            
//             const payload = {
//                 email: email,
//                 role: rolePayload, 
//                 password: password
//             };

//             const response = await authApi.signin(payload);
            
//             console.log("Login Success:", response);

//             context?.setIsLoggedIn(true);

//             context?.setUser({
//                 id: response.user.id,
//                 email: response.user.email,
//                 role: response.user.role,
//                 branch: response.user.branch,
//                 enrollmentNumber: response.user.enrollmentNumber,
//                 semester: response.user.semester,
//                 name: response.user.name,
//                 field: response.user.field // Ensure field is set
//             });
            
//             setCookie('user', response.user, { 
//                 path: '/', 
//                 maxAge: 24 * 60 * 60, 
//                 expires: new Date(Date.now() + 24 * 60 * 60 * 1000) 
//             });
            
//             navigate(`/student/${response.user.id}/subjects`);

//         } catch (error: any) {
//             console.error("Login Failed:", error);
            
//             alert(error.message || "Invalid Credentials or Server Error");
            
//             setLoader(false);
//             setShowCap(false);
//             if(recaptchaRef.current) {
//                 recaptchaRef.current.reset();
//             }
//         }
//     }

//     const handleSingin = (): void => {
//         if (email && password) {
//             setLoader(true)
//             setShowCap(true)
//         } else {
//             alert("Please fill all fields.");
//         }
//     }

//     return (
//         <div className='flex items-start justify-center mt-32 w-full gap-10'>
//             <div className='flex flex-col items-start justify-start p-3 md:p-5 drop-shadow-lg bg-white w-[90%] md:w-[30%] rounded-lg'>
//                 <h2 className='font-semibold text-xl md:text-2xl pb-2 border-b-[1px] w-full border-gray-300'>Student Signin</h2>
                    
//                 <p className='mt-5 text-gray-600'>Enter your credentials to continue</p>

//                 {/* EMAIL INPUT */}
//                 <div className="flex flex-col relative items-center justify-center mt-8 w-full">
//                     <input 
//                         id="email"
//                         type="email" 
//                         placeholder="Your email"
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                         onKeyDown={e => e.key === 'Enter' && document.getElementById('password')!.focus()}
//                         className="peer outline-none border-[1px] border-[#ddd] rounded-lg px-4 py-2 w-full placeholder-transparent focus:border-[#4d86d0]"
//                         />
//                     <label htmlFor="email" className="absolute text-[13px] text-[#646464] px-1 left-3 -top-[17px] peer-placeholder-shown:text-[13px] 2xl:peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-2 transition-all duration-300">Email</label>
//                 </div>

//                 {/* PASSWORD INPUT */}
//                 <div className="flex flex-col relative items-center justify-center mt-8 w-full">
//                     <input 
//                         id="password"
//                         type="password" 
//                         placeholder="Your password"
//                         value={password}
//                         onChange={e => setPassword(e.target.value)}
//                         onKeyDown={e => e.key === 'Enter' && handleSingin()}
//                         className="peer outline-none border-[1px] border-[#ddd] rounded-lg px-4 py-2 w-full placeholder-transparent focus:border-[#4d86d0]"
//                         />
//                     <label htmlFor="password" className="absolute text-[13px] text-[#646464] px-1 left-3 -top-[17px] peer-placeholder-shown:text-[13px] 2xl:peer-placeholder-shown:text-[15px] peer-placeholder-shown:top-2 transition-all duration-300">Password</label>
//                 </div>

//                 {/* SIGNIN BUTTON */}
//                 {!showCap && (
//                     <button onClick={handleSingin} className='flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold w-full text-center rounded-md mt-8 hover:bg-green-700 transition-colors'>
//                         <p>Signin</p>
//                     </button>
//                 )}

//                 {/* LOADER & CAPTCHA */}
//                 {loader && (
//                     <div className='mt-10 w-full flex flex-col items-center justify-center'>
//                         {!showCap ? (
//                              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>   
//                         ) : (
//                             <div className="scale-90 md:scale-100 origin-center">
//                                 <p className='mb-2 text-gray-500 text-center text-sm'>Verify you are a human</p>
//                                 <ReCAPTCHA 
//                                     ref={recaptchaRef}
//                                     sitekey='6LdXXS4qAAAAAGZnNHfloxMkOKrIuiapeJYHBuci' 
//                                     onChange={handleCaptcha} 
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }