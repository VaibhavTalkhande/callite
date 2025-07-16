"use client"
import {useState} from 'react'
import { SignedIn,SignOutButton,SignInButton,SignedOut, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { DashboardIcon } from '@radix-ui/react-icons'
const Navbar = () => {

  return (
    <nav className={`fixed w-full z-10 flex justify-between items-center px-2 bg-white h-16 shadow-xl`} >
        <div className="text-2xl font-bold text-gray-800">
            <Link href={"/"} className="text-gray-800 hover:text-gray-600">
                CalLite
            </Link>
        </div>
        <div className="flex justify-evenly gap-4 items-center p-4  h-16">
            <SignedOut>
            <SignInButton />
            <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
                </button>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
            <Link
            href="/dashboard"
            passHref
            className="bg-slate-900 font-semibold text-white border-white border-2 rounded-[0.5rem] flex py-2 px-4 items-center"
            >

            <DashboardIcon className="mr-2 h-5 w-5" />
                DashBoard
            </Link>
            <UserButton />
            </SignedIn>
        </div>
  </nav>
  )
}

export default Navbar