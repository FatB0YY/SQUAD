import './home-style.css'

import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'
import Logo from '@/public/logo.png'
import Undraw_Friends_online_re_r7pq from '@/public/undraw_Friends_online_re_r7pq.svg'
import Image from 'next/image'

export default async function Home() {
  return (
    <main className='w-full min-h-screen flex flex-col justify-between'>
      <header className='header flex w-full justify-between items-center px-4 sm:px-6 py-1  sm:bg-transparent shadow sm:shadow-none '>
        <div className='flex items-center justify-between'>
          <a
            href='/'
            className='no-underline'
          >
            <Image
              src={Logo}
              alt='Squad | Team Chat Application'
              width={'40'}
              height={'40'}
            />
          </a>
          <span className='text-lg font-semibold text-gray-800 ml-3 dark:text-zinc-200'>
            SQUAD
          </span>
        </div>

        <LoginButton>
          <Button
            variant='primary'
            size='lg'
          >
            Register Now
          </Button>
        </LoginButton>
      </header>
      <div className='w-full flex flex-col items-center justify-center h-full py-12'>
        <div className='flex items-center justify-between w-full md:w-5/6 xl:w-2/3 px-4 sm:px-0'>
          <div className='w-full  text-left sm:w-1/2 py-12 sm:px-8'>
            <h1 className='tracking-wide text-indigo-500 text-2xl mb-6'>
              New Thing:
              <span className='text-gray-800 font-bold tracking tracking-widest dark:text-zinc-200'>
                {' '}
                SQUAD
              </span>
            </h1>
            <h2 className='font-bold tracking-widest text-4xl'>
              Innovate your teamwork...
            </h2>
            <span className='content__container block font-light text-browngray text-2xl my-6'>
              <ul className='content__container__list'>
                <li className='content__container__list__item xl:pl-3'>
                  Discover Cool Features
                </li>
                <li className='content__container__list__item xl:pl-3'>
                  Explore Another Feature
                </li>
                <li className='content__container__list__item xl:pl-3'>
                  Experience Something New
                </li>
                <li className='content__container__list__item xl:pl-3'>
                  Why Not? Let's Collaborate!
                </li>
                <li className='content__container__list__item xl:pl-3'>
                  Embrace the Rotating List
                </li>
                <li className='content__container__list__item xl:pl-3'>
                  More to List
                </li>
                <li className='content__container__list__item xl:pl-3'>
                  Endless Possibilities Here
                </li>
              </ul>
            </span>
            <p className='font-bold tracking-widest text-4xl'>
              ...think outside the box!
            </p>
          </div>
          <div className='w-full sm:w-1/2 ml-5'>
            <Image
              src={Undraw_Friends_online_re_r7pq}
              alt='SQUAD'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-row w-full justify-center pb-12'></div>
    </main>
  )
}

// const t = await getTranslations('Home')
// font.classNameName
