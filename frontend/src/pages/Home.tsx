import Hero from '../components/Hero';
import HowWeSupport from '../components/HowWeSupport';
import TimelyDelivery from '../components/TimelyDelivery';
import ConversionStatement from '../components/ConversionStatement';
import ServiceCards from '../components/ServiceCards';
import JoinTeam from '../components/JoinTeam';
import Closing from '../components/Closing';

export default function Home() {
  return (
    <main>
      <Hero />
      <HowWeSupport />
      <TimelyDelivery />
      <ConversionStatement />
      <ServiceCards />
      <JoinTeam />
      <Closing />
    </main>
  );
}
