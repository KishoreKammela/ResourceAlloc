'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Zap,
  BrainCircuit,
  Users,
  BarChart2,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-accent" />,
    title: 'AI-Powered Matching',
    description:
      'Our Genkit-powered engine intelligently matches the right talent to projects based on skills, experience, and availability.',
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-accent" />,
    title: 'Advanced Skill Management',
    description:
      "Maintain a detailed, up-to-date repository of your team's technical and soft skills, complete with proficiency tracking.",
  },
  {
    icon: <Users className="h-6 w-6 text-accent" />,
    title: 'Comprehensive Profiles',
    description:
      'Manage rich employee profiles, from work preferences and availability to resume parsing and document management.',
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-accent" />,
    title: 'Intelligent Analytics',
    description:
      'Leverage predictive analytics and real-time BI to forecast demand, identify skill gaps, and make data-driven decisions.',
  },
];

const testimonials = [
  {
    name: 'Sarah L.',
    title: 'CEO, TechSolutions',
    quote:
      "ResourceAlloc revolutionized how we manage our talent. We've cut our project staffing time in half and our client satisfaction has never been higher.",
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    name: 'David C.',
    title: 'Head of Engineering, Innovate Inc.',
    quote:
      "The AI-powered skill gap analysis is a game-changer. We can now proactively upskill our team to meet future project demands. It's an indispensable strategic tool.",
    avatar: 'https://i.pravatar.cc/150?u=david',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              The Intelligent Way to Manage Your Tech Talent
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              ResourceAlloc is the AI-powered platform for technical
              consultancies to build winning teams, deliver exceptional
              projects, and drive growth.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Book a Demo</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <Image
              src="https://placehold.co/1200x600.png"
              alt="ResourceAlloc Dashboard"
              width={1200}
              height={600}
              data-ai-hint="dashboard team"
              className="rounded-xl shadow-2xl ring-1 ring-border"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to build the perfect team.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              From AI-driven insights to comprehensive management tools,
              ResourceAlloc has you covered.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full rounded-lg p-6 text-left">
                  <div className="flex h-12 w-12 items-center justify-start rounded-lg bg-accent/10">
                    <div className="mx-auto">{feature.icon}</div>
                  </div>
                  <h3 className="mt-5 font-headline text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
              Staff Projects Intelligently in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our streamlined workflow takes the guesswork out of resource
              allocation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 text-center md:grid-cols-3">
            <div className="p-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-accent/20 bg-accent/10">
                <span className="font-headline text-2xl font-bold text-accent">
                  1
                </span>
              </div>
              <h3 className="mt-6 font-headline text-xl font-bold">
                Define Your Needs
              </h3>
              <p className="mt-2 text-muted-foreground">
                Easily create a new project and specify the exact technical and
                soft skills required for success.
              </p>
            </div>
            <div className="p-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-accent/20 bg-accent/10">
                <span className="font-headline text-2xl font-bold text-accent">
                  2
                </span>
              </div>
              <h3 className="mt-6 font-headline text-xl font-bold">
                Get AI Suggestions
              </h3>
              <p className="mt-2 text-muted-foreground">
                Our AI analyzes your entire talent pool to recommend a perfectly
                balanced team based on skills, roles, and availability.
              </p>
            </div>
            <div className="p-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-accent/20 bg-accent/10">
                <span className="font-headline text-2xl font-bold text-accent">
                  3
                </span>
              </div>
              <h3 className="mt-6 font-headline text-xl font-bold">
                Deploy with Confidence
              </h3>
              <p className="mt-2 text-muted-foreground">
                Assign your vetted team with a single click and monitor project
                health with our integrated analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-card py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
              Trusted by Leading Tech Consultancies
            </h2>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <CardContent className="p-0">
                  <div className="mb-4 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg italic text-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <p className="font-bold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
            Ready to Revolutionize Your Resource Management?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join the consultancies that are building better teams and delivering
            better results with ResourceAlloc.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
