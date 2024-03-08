'use client';

import React from 'react'
import { AppShell, Group, Burger } from '@mantine/core'
// import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from '@mantine/hooks'
import NavigationBar from './components/NavigationBar'

const Home = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      // header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <div>{index}</div> 
            // <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
      <NavigationBar/>
      </AppShell.Main>
      </AppShell>
  )
}

export default Home