import React from 'react'
import {Popover, PopoverTrigger, PopoverContent} from "./ui/popover"
import {Avatar, AvatarImage} from "./ui/avatar"
import {Button} from "./ui/button"
import {User2, LogOut} from "lucide-react"
import { Link, NavLink } from 'react-router-dom'
function Navbar() {
    let user = null //{ role: "student" }


    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <Link to={"/"}><h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1></Link>
                </div>

                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>Companies</li>
                                    <li>Jobs</li>
                                </>
                            ) : (
                                <>
                                    <li className='transition hover:text-red-600 duration-300 cursor-pointer'><Link to={"/"} />Home</li>
                                    <li className='transition hover:text-red-600 duration-300 cursor-pointer'>Jobs</li>
                                    <li className='transition hover:text-red-600 duration-300 cursor-pointer'>Browse</li>
                                </>
                            )
                        }

                    </ul>

                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link  to={"/login"} > <Button className="rounded cursor-grab" variant="outline" >Login</Button> </Link>
                              <Link to={"/signup"} >   <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded cursor-grab">Signup</Button> </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage  alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage  alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>developer</h4>
                                                <p className='text-sm text-muted-foreground'>this is bio</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link">View Profile</Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button  variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Navbar