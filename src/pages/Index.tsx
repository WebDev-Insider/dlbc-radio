
import React from 'react';
import Layout from '@/components/Layout';
import RadioPlayer from '@/components/RadioPlayer';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-church-900">
            Welcome Deeper Life Bible Church Enugu Radio Stream
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Simply press play to listen to our church service live stream
          </p>
        </div>
        
        <RadioPlayer />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-church-100 text-church-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Listen Anywhere</h3>
            <p className="text-gray-600 text-sm">
              Access our church services from any device, anywhere in the world.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-church-100 text-church-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">One-Click Streaming</h3>
            <p className="text-gray-600 text-sm">
              Simply press play to start listening to our live church service.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-church-100 text-church-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Audio Only</h3>
            <p className="text-gray-600 text-sm">
              Enjoy the service with minimal data usage through our audio-only stream.
            </p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-church-50 rounded-lg border border-church-100 max-w-4xl w-full">
          <h2 className="text-xl font-semibold mb-4 text-church-900">How to Listen</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Simply click the large Play button to start listening</li>
            <li>Adjust the volume using the slider below the player</li>
            <li>The stream will continue playing even if you navigate to other tabs</li>
            <li>For best experience, use headphones or external speakers</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
