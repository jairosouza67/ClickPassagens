"""Script de teste para verificar integração com Amadeus API"""
import os
import sys
from decouple import config

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(__file__))

from src.services.flight_api import FlightAPIService

def test_amadeus_connection():
    """Testa a conexão e autenticação com a API Amadeus"""
    print("="*60)
    print("TESTE DE INTEGRAÇÃO COM AMADEUS API")
    print("="*60)
    
    # Verificar credenciais
    api_key = config('AMADEUS_API_KEY', default='')
    api_secret = config('AMADEUS_API_SECRET', default='')
    base_url = config('AMADEUS_BASE_URL', default='')
    
    print(f"\n1. Verificando Credenciais:")
    print(f"   API Key: {api_key[:10]}...{api_key[-4:] if len(api_key) > 14 else ''}")
    print(f"   API Secret: {'*' * len(api_secret)}")
    print(f"   Base URL: {base_url}")
    
    if not api_key or not api_secret:
        print("\n❌ ERRO: Credenciais não configuradas!")
        return False
    
    # Criar serviço
    print(f"\n2. Criando FlightAPIService...")
    try:
        service = FlightAPIService()
        print(f"   ✓ Serviço criado com sucesso")
        print(f"   Modo: {service.mode}")
        print(f"   Allow Fallback: {service.allow_fallback}")
    except Exception as e:
        print(f"   ❌ Erro ao criar serviço: {e}")
        return False
    
    # Obter token
    print(f"\n3. Obtendo token de autenticação...")
    try:
        token = service.get_amadeus_token()
        if token:
            print(f"   ✓ Token obtido com sucesso: {token[:20]}...{token[-10:]}")
        else:
            print(f"   ⚠️  Falha ao obter token (credenciais podem estar inválidas)")
            if not service.allow_fallback:
                print(f"   ❌ Fallback desativado - teste cancelado")
                return False
            print(f"   ℹ️  Fallback ativado - continuando com dados simulados")
    except Exception as e:
        print(f"   ❌ Erro ao obter token: {e}")
        if not service.allow_fallback:
            import traceback
            traceback.print_exc()
            return False
        print(f"   ℹ️  Fallback ativado - continuando com dados simulados")
    
    # Fazer busca de teste
    print(f"\n4. Fazendo busca de teste (GRU -> GIG em 2025-10-15)...")
    try:
        resultados = service.search_flights(
            origem="GRU",
            destino="GIG",
            data_ida="2025-10-15",
            passageiros=1
        )
        
        if resultados:
            print(f"   ✓ Busca retornou {len(resultados)} resultados")
            print(f"\n5. Exemplo de resultado:")
            if len(resultados) > 0:
                primeiro = resultados[0]
                print(f"   Companhia: {primeiro['companhia']['nome']} ({primeiro['companhia']['codigo']})")
                print(f"   Voo: {primeiro['voo_numero']}")
                print(f"   Horário: {primeiro['horario_saida']} - {primeiro['horario_chegada']}")
                print(f"   Preço: R$ {primeiro['preco_dinheiro']:.2f}")
                print(f"   Milhas: {primeiro['milhas_necessarias']:,}")
                print(f"   Paradas: {primeiro['paradas']}")
        else:
            print(f"   ⚠️  Nenhum resultado retornado")
            print(f"   Isso pode indicar que a API Amadeus não tem voos para esta rota/data")
            return False
            
    except Exception as e:
        print(f"   ❌ Erro na busca: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print(f"\n{'='*60}")
    print(f"✓ TESTE CONCLUÍDO COM SUCESSO!")
    print(f"{'='*60}\n")
    return True

if __name__ == "__main__":
    success = test_amadeus_connection()
    sys.exit(0 if success else 1)
