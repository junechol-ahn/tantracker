import { Button } from '@/components/ui/button';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import cover from '@/assets/cover.webp';
import { ChartColumnBigIcon } from 'lucide-react';
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/tanstack-react-start';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-[400px] h-[calc(100vh-80px)] flex items-center justify-center relative">
      <img
        src={cover}
        alt=""
        className="absolute top-0 left-0 object-cover object-center h-full w-full opacity-50"
      />
      <div className="flex flex-col gap-4 text-center z-10">
        <h1 className="text-5xl font-bold flex gap-1 items-center">
          <ChartColumnBigIcon size={60} className="text-lime-500" /> TanTracker
        </h1>
        <p className="text-2xl ">Track your finances with ease</p>
        <Show when="signed-in">
          <Button asChild size="lg">
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
        </Show>
        <Show when="signed-out">
          <div className="flex gap-2 items-center justify-center">
            <Button asChild size='lg' className="min-w-25 bg-lime-600 hover:bg-lime-700">
              <SignInButton />
            </Button>
            <div className="w-px h-8 mx-4 bg-zinc-700"></div>
            <Button asChild size='lg' className="min-w-25 bg-gray-950 hover:bg-gray-800">
              <SignUpButton />
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
}
