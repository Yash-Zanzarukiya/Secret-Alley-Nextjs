"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "../../message.json";
import autoplay from "embla-carousel-autoplay";
import { GithubIcon, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

function LandingPage() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white bg-gradient-to-b from-gray-900 to-gray-600">
        <section className="text-center mb-8 md:mb-14">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Secret Alley - Where your identity remains a secret.
          </p>
        </section>
        {/* Carousel for Messages */}
        <Carousel plugins={[autoplay({ delay: 2000 })]} className="w-full max-w-lg md:max-w-xl">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gradient-to-t from-gray-900 to-gray-900 text-white flex justify-around">
        <span>© 2024 SecretAlley. All rights reserved.</span>
        <span className="flex space-x-4">
          <span>Connect with me</span>
          <Link
            title="Twitter"
            className=" hover:text-blue-500"
            href={"https://x.com/y_zanzarukiya"}
            target="_blank"
          >
            {<Twitter />}
          </Link>
          <Link
            title="Github"
            className=" hover:text-gray-500"
            href={"https://github.com/Yash-Zanzarukiya"}
            target="_blank"
          >
            {<GithubIcon />}
          </Link>
          <Link
            title="Linkedin"
            className=" hover:text-blue-500"
            href={"http://www.linkedin.com/in/yash-zanzarukiya"}
            target="_blank"
          >
            {<Linkedin />}
          </Link>
        </span>
      </footer>
    </>
  );
}

export default LandingPage;
