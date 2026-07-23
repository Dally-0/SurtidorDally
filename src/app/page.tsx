'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Fuel,
  Droplets,
  Wind,
  BarChart3,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  Timer,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-start overflow-hidden"
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs tracking-figma-wide text-accent font-medium">
              SISTEMA DE GESTIÓN ACTIVO
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-figma text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mb-8 animate-fade-in-up stagger-1 opacity-0">
            COMBUSTIBLE<br />
            <span className="text-accent">QUE MUEVE</span><br />
            AL PAÍS
          </h1>

          {/* Subtitle */}
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in-up stagger-2 opacity-0">
            Servicio de abastecimiento confiable, tecnología de punta y
            atención personalizada para flotas, empresas y particulares.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3 opacity-0">
            <a
              href="#servicios"
              id="hero-cta-services"
              className="group inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-background font-semibold tracking-figma px-8 py-3.5 rounded transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              VER SERVICIOS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contacto"
              id="hero-cta-contact"
              className="inline-flex items-center gap-2 border border-border hover:border-text-secondary text-text-primary font-semibold tracking-figma px-8 py-3.5 rounded transition-all hover:bg-surface"
            >
              CONTACTAR
            </a>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-t border-b border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '120,000', label: 'Litros/día despachados', icon: Droplets },
              { value: '12', label: 'Estaciones operativas', icon: MapPin },
              { value: '28', label: 'Años de experiencia', icon: Timer },
              { value: '360+', label: 'Clientes corporativos', icon: Users },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center animate-fade-in-up stagger-${i + 1} opacity-0`}
              >
                <stat.icon className="w-5 h-5 text-accent mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-black text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs tracking-figma text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <span className="text-sm tracking-figma-wide text-text-muted">
              — 01 / SERVICIOS
            </span>
            <h2 className="heading-figma text-4xl md:text-5xl mt-4 text-text-primary">
              LO QUE OFRECEMOS
            </h2>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Gasolina */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-gasolina">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Fuel className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GASOLINA 91 Y 95</h3>
              <p className="text-text-secondary leading-relaxed">
                Combustible certificado con control de calidad permanente.
                Disponibilidad 24/7 en todos los surtidores.
              </p>
            </div>

            {/* Card 2: Diesel */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-diesel">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Droplets className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">DIESEL B5 Y B20</h3>
              <p className="text-text-secondary leading-relaxed">
                Para flotas y transporte pesado. Mezcla biodiésel disponible.
                Facturación electrónica integrada.
              </p>
            </div>

            {/* Card 3: GNV */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-gnv">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Wind className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GNV COMPRIMIDO</h3>
              <p className="text-text-secondary leading-relaxed">
                Gas natural vehicular de alta pureza. Estaciones equipadas
                con compresores de última generación.
              </p>
            </div>

            {/* Card 4: Gestión de Flotas */}
            <div className="bg-surface border border-border rounded-xl p-8 card-hover group" id="service-flotas">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-figma mb-3">GESTIÓN DE FLOTAS</h3>
              <p className="text-text-secondary leading-relaxed">
                Sistema de control de consumo por vehículo. Reportes
                personalizados y crédito empresarial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOSOTROS ===== */}
      <section id="nosotros" className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <span className="text-sm tracking-figma-wide text-text-muted">
              — 02 / NOSOTROS
            </span>
          </div>

          <div className="max-w-4xl">
            <h2 className="heading-figma text-4xl md:text-6xl text-text-primary mb-2">
              28 AÑOS
            </h2>
            <h2 className="heading-figma text-4xl md:text-6xl text-accent mb-10">
              EN MOVIMIENTO
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Dally Srl nació en 1996 como un surtidor familiar en el sur del país.
              Hoy operamos 12 estaciones de servicio con tecnología de telemetría
              en tiempo real, atendiendo a más de 340 clientes corporativos y
              miles de conductores particulares.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-12">
              Nuestro compromiso es ofrecer combustible de calidad certificada,
              precios transparentes y un sistema de gestión que garantiza
              trazabilidad completa en cada transacción.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Certificación ISO 9001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Calidad garantizada
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-info" />
                <span className="text-sm tracking-figma text-text-secondary">
                  Operación 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <span className="text-sm tracking-figma-wide text-text-muted">
              — 03 / CONTACTO
            </span>
            <h2 className="heading-figma text-4xl md:text-5xl mt-4 text-text-primary">
              HABLEMOS
            </h2>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  DIRECCIÓN
                </span>
                <span className="text-sm text-text-secondary">
                  Av. Petrolera 1450, Parque Industrial Sur, Santa Cruz de la Sierra
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  TELÉFONO
                </span>
                <span className="text-sm text-text-secondary">
                  +591 3 344-7800 / +591 70-123-456
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  CORREO
                </span>
                <span className="text-sm text-text-secondary">
                  operaciones@dallysrl.bo / flotas@dallysrl.bo
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
                  HORARIO
                </span>
                <span className="text-sm text-text-secondary">
                  Abierto 24 horas — 365 días del año
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            id="contact-form"
            className="max-w-4xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                  NOMBRE
                </label>
                <input
                  type="text"
                  id="contact-nombre"
                  placeholder="Juan Pérez"
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                  EMPRESA
                </label>
                <input
                  type="text"
                  id="contact-empresa"
                  placeholder="Transportes S.A."
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                id="contact-email"
                placeholder="correo@empresa.com"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-8">
              <label className="text-xs tracking-figma-wide text-text-muted block mb-2">
                MENSAJE
              </label>
              <textarea
                id="contact-mensaje"
                rows={5}
                placeholder="¿En qué podemos ayudarle?"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              id="contact-submit"
              className="w-full bg-accent hover:bg-accent-hover text-background font-bold tracking-figma py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              ENVIAR MENSAJE
            </button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-accent" />
              <span className="text-sm tracking-figma text-text-muted">
                DALLY SRL
              </span>
            </div>
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} Dally SRL. Todos los derechos reservados.
            </p>
            <Link
              href="/login"
              className="text-xs tracking-figma text-accent hover:text-accent-hover transition-colors"
            >
              ACCESO AL SISTEMA →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
