import React from 'react';
import { FileText, Shield, Users, AlertCircle, Lock, Scale, ArrowLeft } from 'lucide-react';
import './TermsPage.css';

const TermsPage = ({ onNavigate }) => {
  const sections = [
    {
      id: 1,
      title: '1. Aceitação e atualizações',
      icon: <FileText size={24} />,
      content: [
        'Ao utilizar a Plataforma, você declara ter lido, compreendido e aceitado estes Termos e a Política de Privacidade aplicável.',
        'A ClickPassagens poderá alterar estes Termos a qualquer momento. As alterações serão publicadas na Plataforma; o uso contínuo após a publicação implica aceitação dos novos Termos.'
      ]
    },
    {
      id: 2,
      title: '2. Objeto da Plataforma',
      icon: <Shield size={24} />,
      content: [
        'A Plataforma oferece ferramentas de busca, comparação e apresentação de opções de passagens (em dinheiro e/ou milhas) para empresas que atuam no atendimento ao público.',
        'A ClickPassagens atua como intermediária de informações; a venda, emissão de bilhetes e prestação dos serviços de transporte são realizados por terceiros (companhias aéreas, agências e parceiros).'
      ]
    },
    {
      id: 3,
      title: '3. Elegibilidade e cadastro',
      icon: <Users size={24} />,
      content: [
        'A Plataforma destina-se prioritariamente a empresas e profissionais que compram passagens para clientes ou colaboradores.',
        'Para acessar determinadas funções pode ser necessário criar uma conta. Ao se cadastrar, você se compromete a fornecer informações verdadeiras, precisas e atualizadas.',
        'Você é responsável pela segurança de suas credenciais e por todas as atividades realizadas por meio de sua conta.'
      ]
    },
    {
      id: 4,
      title: '4. Uso aceitável',
      icon: <AlertCircle size={24} />,
      content: [
        'Você concorda em utilizar a Plataforma de forma lícita, ética e respeitosa, não praticando atos que prejudiquem a Plataforma, seus usuários ou terceiros.',
        'É vedado:',
        '• Realizar uso automatizado/abusivo que prejudique o funcionamento da Plataforma;',
        '• Acessar áreas restritas sem autorização;',
        '• Praticar fraudes, manipulações de preço ou qualquer atividade ilegal.'
      ]
    },
    {
      id: 5,
      title: '5. Informações sobre voos, preços e disponibilidade',
      icon: <AlertCircle size={24} />,
      content: [
        'As informações apresentadas (horários, preços, disponibilidade, tarifas em milhas, etc.) têm caráter informativo e podem variar rapidamente.',
        'A ClickPassagens se esforça para manter os dados atualizados, mas não garante total precisão ou disponibilidade em tempo real.',
        'A efetivação da compra, condições finais e responsabilidades comerciais são estabelecidas entre o comprador e o fornecedor (companhia aérea ou parceiro).'
      ]
    },
    {
      id: 6,
      title: '6. Responsabilidades e limitações',
      icon: <Shield size={24} />,
      content: [
        'A ClickPassagens não se responsabiliza por:',
        '• Alterações de preço, cancelamentos ou alterações de voos promovidas por terceiros;',
        '• Falhas na conclusão de compra junto a parceiros;',
        '• Danos indiretos, lucros cessantes ou qualquer perda decorrente do uso da Plataforma, salvo quando a lei aplicável exigir outra coisa.',
        'Na medida máxima permitida por lei, a responsabilidade total da ClickPassagens por danos diretos ficará limitada ao valor efetivamente pago pelo usuário à Plataforma, quando aplicável.'
      ]
    },
    {
      id: 7,
      title: '7. Propriedade intelectual',
      icon: <Lock size={24} />,
      content: [
        'Todo o conteúdo da Plataforma (textos, imagens, marcas, designs, softwares e demais elementos) é protegido por direitos de propriedade intelectual e pertence à ClickPassagens ou a seus licenciadores.',
        'É proibido copiar, reproduzir, modificar ou distribuir o conteúdo sem autorização expressa.'
      ]
    },
    {
      id: 8,
      title: '8. Links e serviços de terceiros',
      icon: <AlertCircle size={24} />,
      content: [
        'A Plataforma pode conter links ou integrar serviços de terceiros. A ClickPassagens não controla tais serviços e não se responsabiliza pelo conteúdo, políticas ou práticas desses terceiros.'
      ]
    },
    {
      id: 9,
      title: '9. Indenização',
      icon: <Scale size={24} />,
      content: [
        'Você concorda em indenizar a ClickPassagens por quaisquer reclamações, perdas, responsabilidades, danos e despesas (incluindo honorários advocatícios) decorrentes do uso indevido da Plataforma, violação destes Termos ou violação de direitos de terceiros.'
      ]
    },
    {
      id: 10,
      title: '10. Suspensão e rescisão',
      icon: <AlertCircle size={24} />,
      content: [
        'A ClickPassagens poderá suspender ou encerrar, temporária ou definitivamente, o acesso de qualquer usuário que viole estes Termos ou que pratique condutas que prejudiquem a Plataforma, sem prejuízo de outras medidas legais cabíveis.'
      ]
    },
    {
      id: 11,
      title: '11. Privacidade e proteção de dados',
      icon: <Lock size={24} />,
      content: [
        'O tratamento de dados pessoais é regido pela Política de Privacidade da Plataforma. Recomenda-se a leitura dessa política para entender como dados são coletados, usados e protegidos.'
      ]
    },
    {
      id: 12,
      title: '12. Lei aplicável e foro',
      icon: <Scale size={24} />,
      content: [
        'Estes Termos são regidos pela legislação brasileira.',
        'Para solução de controvérsias decorrentes destes Termos, fica eleito o foro da comarca de Vitória da Conquista, Estado da Bahia, com renúncia a qualquer outro, por mais privilegiado que seja.'
      ]
    },
    {
      id: 13,
      title: '13. Disposições finais',
      icon: <FileText size={24} />,
      content: [
        'Caso qualquer disposição destes Termos seja considerada inválida ou inexequível, as demais permanecerão em pleno vigor.',
        'A ausência de exercício de qualquer direito previsto nestes Termos não constitui renúncia ao direito correspondente.'
      ]
    }
  ];

  return (
    <div className="terms-page">
      {/* Header */}
      <div className="terms-header">
        <div className="container-terms">
          <button 
            onClick={() => onNavigate && onNavigate('busca')}
            className="btn-back-terms"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <div className="terms-header-content">
            <div className="terms-badge">
              <Scale size={20} />
              <span>Termos de Uso</span>
            </div>
            <h1 className="terms-title">Termos de Uso — ClickPassagens</h1>
            <p className="terms-intro">
              Bem-vindo(a) à ClickPassagens. Estes Termos de Uso regem o acesso e a utilização 
              da plataforma ClickPassagens ("Plataforma"), destinada a auxiliar empresas na busca 
              e comparação de passagens aéreas com foco na otimização do uso de milhas. Ao acessar 
              ou utilizar a Plataforma, você concorda com estes Termos. Se não concordar com qualquer 
              disposição, não utilize a Plataforma.
            </p>
            <div className="terms-date">
              <p>Última atualização: Outubro de 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="terms-content">
        <div className="container-terms">
          <div className="terms-sections">
            {sections.map((section) => (
              <div key={section.id} className="term-section">
                <div className="term-section-header">
                  <div className="term-icon">
                    {section.icon}
                  </div>
                  <h2 className="term-section-title">{section.title}</h2>
                </div>
                <div className="term-section-content">
                  {section.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Aviso Importante */}
          <div className="terms-important">
            <div className="important-icon">
              <AlertCircle size={32} />
            </div>
            <div className="important-content">
              <h3>Importante</h3>
              <p>
                Ao utilizar a ClickPassagens, você concorda com todos os termos aqui descritos. 
                Caso tenha dúvidas sobre qualquer cláusula, entre em contato conosco antes de 
                utilizar a plataforma.
              </p>
            </div>
          </div>

          {/* Botão de Contato */}
          <div className="terms-footer-cta">
            <p>Tem dúvidas sobre nossos termos?</p>
            <button 
              className="btn-contact-terms"
              onClick={() => onNavigate && onNavigate('contato')}
            >
              Entre em contato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
