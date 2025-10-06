# Arquitetura do Site de Milhas

Este documento descreve a arquitetura técnica para o desenvolvimento do site de busca de passagens aéreas com milhas, com base nos requisitos do documento técnico fornecido.

## Arquitetura Técnica Recomendada

A arquitetura do sistema foi projetada para ser robusta, escalável e de fácil manutenção, utilizando tecnologias modernas e comprovadas no mercado. As escolhas foram feitas com base nas recomendações do documento técnico e visam otimizar tanto o desenvolvimento quanto a experiência do usuário final.

### Frontend

Para o frontend, a escolha recai sobre o **Next.js**, um framework React que se destaca pela sua capacidade de renderização do lado do servidor (SSR) e geração de sites estáticos (SSG). Essa característica é fundamental para melhorar a otimização para motores de busca (SEO) e proporcionar um tempo de carregamento inicial mais rápido, resultando em uma melhor experiência para o usuário. A interface será construída com a biblioteca **Material-UI**, que oferece um vasto conjunto de componentes de UI prontos para uso, personalizáveis e que seguem as diretrizes do Material Design, o que acelera significativamente o processo de desenvolvimento. Para o gerenciamento de estado da aplicação, optou-se pelo **Zustand**, uma solução mais leve e simples em comparação com alternativas como o Redux, mas que ainda assim oferece todo o poder necessário para gerenciar os estados complexos da aplicação, como os filtros de busca e os dados do usuário. A estilização dos componentes será feita com **Styled-components**, permitindo a criação de componentes com estilos encapsulados, o que evita conflitos de CSS e facilita a manutenção do código em longo prazo.

### Backend

O backend será desenvolvido em **Node.js** utilizando o framework **Express**. Essa combinação é extremamente popular e eficiente para a construção de APIs RESTful, além de contar com um ecossistema de bibliotecas maduro e abrangente. O armazenamento principal de dados será feito no **PostgreSQL**, um sistema de gerenciamento de banco de dados relacional conhecido por sua robustez, confiabilidade e conformidade com o padrão SQL. Para otimizar a performance, o **Redis** será utilizado como um sistema de cache para armazenar sessões de usuário e dados que são acessados com frequência, como os resultados de buscas recentes. A comunicação entre o frontend e o backend será feita através de uma **API RESTful**, um padrão de arquitetura amplamente adotado e bem compreendido pela comunidade de desenvolvedores. A autenticação dos usuários será implementada utilizando **JSON Web Tokens (JWT)**, um método seguro e stateless que permite a criação de um sistema de autenticação escalável.

### Infraestrutura

A infraestrutura do sistema será hospedada na **Amazon Web Services (AWS)**, uma plataforma de computação em nuvem líder de mercado que oferece uma vasta gama de serviços escaláveis e confiáveis. Para a distribuição de conteúdo global, otimização de performance e segurança, será utilizado o **Cloudflare** como Content Delivery Network (CDN). O processo de integração e entrega contínua (CI/CD) será automatizado com o **GitHub Actions**, o que permitirá a realização de builds, testes e deploys de forma rápida e segura. Por fim, a aplicação será containerizada com o **Docker**, o que garante a criação de ambientes de desenvolvimento e produção consistentes e isolados, facilitando o deploy e a escalabilidade da aplicação.



## Funcionalidades Essenciais

O sistema incorporará um conjunto abrangente de funcionalidades para atender às diversas necessidades dos usuários, desde a busca de passagens até a gestão de planos e comissões. As principais funcionalidades incluem:

### Sistema de Usuários

- **Cadastro e Login:** Suporte para cadastro via e-mail, Google e Facebook, oferecendo flexibilidade e conveniência. [1]
- **Perfis de Usuário:** Diferenciação entre perfis Básico, Premium, Agente e Administrador, cada um com um dashboard personalizado e acesso a funcionalidades específicas. [1]
- **Histórico:** Registro de buscas e emissões realizadas, permitindo aos usuários acompanhar suas atividades. [1]

### Busca de Passagens

- **Busca Flexível:** Capacidade de buscar passagens por origem, destino e data, com opção de seleção múltipla de companhias aéreas e busca flexível de datas (+/- 3 dias). [1]
- **Filtros Avançados:** Diversos filtros para refinar a busca, incluindo companhia aérea, número de paradas, horário, bagagem incluída, classe e preço máximo. [1]

### Comparação e Precificação

- **Visualização Dupla:** Apresentação simultânea de preços em milhas e em dinheiro, facilitando a comparação e a tomada de decisão. [1]
- **Cálculo de Economia:** Cálculo automático da economia gerada ao optar por milhas. [1]
- **Precificação Configurável:** Possibilidade de configurar o valor do milheiro por companhia aérea. [1]

### Sistema de Planos

- **Múltiplos Planos:** Oferecimento de planos Gratuito, Básico, Premium, Agente e Empresa, cada um com um limite de consultas mensais e benefícios adicionais. [1]
- **Contabilização de Consultas:** As consultas são contabilizadas por companhia aérea por busca, e não por clique, otimizando o uso dos planos. [1]

### Orçamento Personalizado

- **Editor Visual:** Ferramenta para criar orçamentos personalizados com customização de título, subtítulo, observações, logo e cores da marca. [1]
- **Geração de PDF:** Capacidade de gerar orçamentos em formato PDF profissional. [1]

### Sistema de Comissões

- **Configuração Flexível:** Definição de comissões percentuais ou fixas por companhia aérea e por trecho/passageiro. [1]
- **Relatórios:** Geração de relatórios detalhados de comissões e histórico financeiro. [1]

### Programa de Indicação e Cashback

- **Link Único:** Geração de link de indicação exclusivo para cada usuário. [1]
- **Comissão por Indicação:** Recompensa por cada novo usuário indicado que realizar o primeiro pagamento. [1]
- **Cashback:** Percentual de cashback sobre o valor das emissões, com saldo e histórico de resgates. [1]

## Fluxos de Usuário

O sistema foi projetado para suportar diferentes jornadas de usuário, garantindo uma experiência otimizada para cada perfil.

### Fluxo Usuário Básico

1.  **Acesso ao Site:** O usuário acessa a plataforma.
2.  **Busca Limitada:** Realiza buscas de passagens com funcionalidades limitadas, sem necessidade de cadastro inicial.
3.  **Visualização Básica:** Visualiza resultados preliminares.
4.  **Cadastro:** É incentivado a se cadastrar para acessar preços completos e funcionalidades avançadas.
5.  **Redirecionamento:** Após a seleção, é redirecionado para o site da companhia aérea para finalização da compra. [1]

### Fluxo Usuário Premium

1.  **Login:** Realiza o login em sua conta.
2.  **Busca Avançada:** Utiliza a busca com todos os filtros disponíveis.
3.  **Comparação Detalhada:** Acessa a comparação detalhada de milhas vs. dinheiro.
4.  **Orçamento Personalizado:** Pode gerar orçamentos personalizados.
5.  **Emissão/Redirecionamento:** Opção de emissão direta ou redirecionamento para a companhia. [1]

### Fluxo Agente de Viagem

1.  **Login no Painel:** Acessa um painel exclusivo para agentes.
2.  **Configuração:** Configura precificação e comissões.
3.  **Busca para Cliente:** Realiza buscas em nome de seus clientes.
4.  **Orçamento com Marca:** Gera orçamentos com sua própria marca.
5.  **Envio e Acompanhamento:** Envia orçamentos e acompanha a conversão. [1]

### Fluxo Administrador

1.  **Acesso ao Painel Admin:** Acessa o painel de administração.
2.  **Gestão:** Gerencia usuários, planos e integrações.
3.  **Relatórios:** Acessa relatórios financeiros e de uso.
4.  **Suporte:** Presta suporte aos usuários. [1]

## Referências

[1] Documento Técnico Completo: Site de Busca de Passagens Aéreas com Milhas. (2025).
