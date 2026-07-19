import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Sections/Hero';
import Expertise from '../components/Sections/Expertise';
import Experience from '../components/Sections/Experience';
import Projects from '../components/Sections/Projects';
import OdooApps from '../components/Sections/OdooApps';
import About from '../components/Sections/About';
import Testimonials from '../components/Sections/Testimonials';
import Contact from '../components/Sections/Contact';

const Home = () => {
    const { hash } = useLocation();

    // Scroll to the section when arriving with a #hash (e.g. from the terminal page)
    useEffect(() => {
        if (hash) {
            document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);

    return (
        <main>
            <Hero />
            <Expertise />
            <Experience />
            <Projects />
            <OdooApps />
            <About />
            <Testimonials />
            <Contact />
        </main>
    );
};

export default Home;
