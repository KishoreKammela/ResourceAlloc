'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Users, Briefcase } from 'lucide-react';

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
    <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
      {icon}
    </div>
    <h3 className="font-headline text-xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function LandingPage() {
  return (
    <>
      <section className="bg-grid relative w-full overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Intelligent Resource Allocation,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Stop guessing. Start deploying your top tech talent with
              precision. ResourceAlloc analyzes skills, availability, and
              project needs to build your optimal team, every time.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="w-full bg-background py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Why Choose ResourceAlloc?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Our platform is purpose-built to solve the unique challenges of
              technical consultancies and software agencies.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<BrainCircuit size={32} />}
              title="AI-Powered Matching"
              description="Our GenAI engine goes beyond keywords to match skills, experience, and even team dynamics to project requirements."
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Centralized Talent Pool"
              description="Get a real-time, comprehensive view of every employee's skills, certifications, and availability in one place."
            />
            <FeatureCard
              icon={<Briefcase size={32} />}
              title="Streamlined Project Staffing"
              description="From requirement intake to assembling the perfect team, our platform simplifies the entire resource allocation lifecycle."
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-muted/40 py-20 md:py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="https://placehold.co/600x400.png"
              alt="Dashboard Screenshot"
              data-ai-hint="dashboard analytics"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Data-Driven Decisions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Visualize your team&apos;s skills landscape, identify gaps, and
              forecast hiring needs with our intelligent analytics dashboard.
              Turn your talent data into a strategic advantage.
            </p>
            <Button asChild className="mt-6">
              <Link href="/signup">Explore Features</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
