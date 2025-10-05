"""
Teste rápido da API de busca de voos
"""
import requests
import json
from datetime import datetime, timedelta

# URL do backend
BASE_URL = "http://localhost:5001"

def test_health():
    """Testa se o servidor está respondendo"""
    print("🔍 Testando health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Erro no health check: {e}")
        return False

def test_search():
    """Testa busca de voos"""
    print("\n🔍 Testando busca de voos...")
    
    # Data de amanhã
    tomorrow = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    
    payload = {
        'origem': 'GRU',
        'destino': 'GIG',
        'data_ida': tomorrow,
        'passageiros': 1,
        'classe': 'economica'
    }
    
    print(f"📤 Enviando: {payload}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/buscar",
            json=payload,
            timeout=60
        )
        
        print(f"📥 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sucesso!")
            print(f"   Voos encontrados: {len(data.get('resultados', []))}")
            
            if data.get('resultados'):
                first_flight = data['resultados'][0]
                print(f"\n   Primeiro voo:")
                print(f"   - Companhia: {first_flight['companhia']['nome']}")
                print(f"   - Voo: {first_flight['voo_numero']}")
                print(f"   - Horário: {first_flight['horario_saida']} → {first_flight['horario_chegada']}")
                print(f"   - Milhas: {first_flight['milhas_necessarias']:,}")
                print(f"   - Dinheiro: R$ {first_flight['preco_dinheiro']:.2f}")
                print(f"   - Programa: {first_flight.get('programa_fidelidade', 'N/A')}")
                print(f"   - Confiança: {first_flight.get('nivel_confianca', 'N/A')}")
            else:
                print("   ⚠️ Nenhum voo encontrado")
                print(f"   Resposta completa: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Erro {response.status_code}")
            print(f"   Response: {response.text[:500]}")
            
    except Exception as e:
        print(f"❌ Erro na busca: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("=" * 60)
    print("   TESTE RÁPIDO DA API DE VOOS")
    print("=" * 60)
    
    if test_health():
        test_search()
    else:
        print("\n❌ Backend não está respondendo. Execute: python main.py")
    
    print("\n" + "=" * 60)
