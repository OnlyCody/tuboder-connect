import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const projectAreas = [
    { id: 1, title: t('about.projects.1.title'), description: t('about.projects.1.description') },
    { id: 2, title: t('about.projects.2.title'), description: t('about.projects.2.description') },
    { id: 3, title: t('about.projects.3.title'), description: t('about.projects.3.description') },
    { id: 4, title: t('about.projects.4.title'), description: t('about.projects.4.description') },
    { id: 5, title: t('about.projects.5.title'), description: t('about.projects.5.description') },
    { id: 6, title: t('about.projects.6.title'), description: t('about.projects.6.description') },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 bg-hero-gradient bg-clip-text text-transparent">
          {t('about.title')}
        </h1>
        
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Dernek Hakkında */}
          <section className="bg-card rounded-lg shadow-elegant p-8">
            <p className="text-lg text-foreground leading-relaxed">
              {t('about.description')}
            </p>
          </section>

          {/* Vizyon ve Misyon */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-card rounded-lg shadow-elegant p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{t('about.vision.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.vision.description')}
              </p>
            </section>

            <section className="bg-card rounded-lg shadow-elegant p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{t('about.mission.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.mission.description')}
              </p>
            </section>
          </div>

          {/* Proje Alanları */}
          <section className="bg-card rounded-lg shadow-elegant p-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">
              {t('about.projectsTitle')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projectAreas.map((project) => (
                <div 
                  key={project.id}
                  className="bg-secondary/30 rounded-lg p-6 hover:shadow-glow transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {project.id}. {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;