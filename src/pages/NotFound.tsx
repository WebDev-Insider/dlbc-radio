
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-6 inline-block">
            <div className="h-24 w-24 rounded-full bg-church-100 flex items-center justify-center mx-auto">
              <Radio className="h-12 w-12 text-church-500" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-church-800">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! This station doesn't exist
          </p>
          <Button 
            asChild 
            className="bg-church-600 hover:bg-church-700"
          >
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
