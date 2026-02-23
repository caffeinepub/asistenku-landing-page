import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface ServiceCard {
  id: string;
  emoji: string;
  title: string;
  shortDescription: string;
  price: string;
  units: string;
  fullDescription: string;
}

const services: ServiceCard[] = [
  {
    id: 'tenang',
    emoji: '🧘',
    title: 'TENANG',
    shortDescription: 'Untuk kebutuhan dasar yang tetap terkendali.',
    price: 'Rp 3.500.000',
    units: '22 Unit Layanan',
    fullDescription:
      'Paket ini cocok untuk kebutuhan operasional rutin yang perlu berjalan stabil tanpa Anda harus mengatur detail teknisnya. Struktur kerja disusun oleh Asistenmu dan dijalankan oleh Partner yang sesuai. Untuk kebutuhan dengan skala yang lebih besar, struktur layanan dapat dikurasi bersama Concierge kami.',
  },
  {
    id: 'rapi',
    emoji: '🗂️',
    title: 'RAPI',
    shortDescription: 'Struktur kerja dan personal lebih tertata dan stabil.',
    price: 'Rp 5.500.000',
    units: '35 Unit Layanan',
    fullDescription:
      'Dirancang untuk bisnis yang mulai bertumbuh dan membutuhkan pengaturan prioritas serta kontrol revisi yang lebih rapi. Anda tidak mengelola orang — Anda menerima hasil yang sudah melalui struktur. Untuk kebutuhan yang lebih kompleks, alokasi unit dapat disesuaikan melalui Concierge.',
  },
  {
    id: 'fokus',
    emoji: '🎯',
    title: 'FOKUS',
    shortDescription: 'Eksekusi lebih dalam dengan prioritas jelas.',
    price: 'Rp 8.500.000',
    units: '60 Unit Layanan',
    fullDescription:
      'Cocok untuk fase ekspansi, campaign, atau operasional dengan tingkat koordinasi tinggi. Beberapa Partner dapat bekerja paralel dalam struktur yang dikendalikan Asistenmu. Struktur layanan dapat dikurasi sesuai kebutuhan skala bisnis Anda.',
  },
  {
    id: 'jaga',
    emoji: '🛡️',
    title: 'JAGA',
    shortDescription: 'Kontrol menyeluruh untuk tanggung jawab besar.',
    price: 'Rp 12.000.000',
    units: '80 Unit Layanan',
    fullDescription:
      'Untuk pemilik bisnis atau eksekutif yang membutuhkan stabilitas eksekusi tanpa kehilangan kendali strategis. Delegasi berjalan sistematis dengan monitoring terstruktur. Untuk kebutuhan skala besar dan lintas fungsi, struktur layanan disusun bersama Concierge.',
  },
];

export default function ServiceCards() {
  return (
    <section id="service-cards" className="scroll-mt-16 py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <Accordion type="single" collapsible className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <AccordionItem
              key={service.id}
              value={service.id}
              className="rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-start gap-4 text-left">
                  <span className="text-4xl">{service.emoji}</span>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-navy">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 pt-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-2xl font-bold text-teal">
                      {service.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      untuk alokasi {service.units}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.fullDescription}
                  </p>
                  <Button
                    className="w-full bg-teal text-white hover:bg-teal/90"
                    asChild
                  >
                    <a
                      href="https://wa.me/628817743613"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hubungi Concierge Kami
                    </a>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
