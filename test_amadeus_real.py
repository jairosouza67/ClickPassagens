"""Teste rápido - Verificar se Amadeus está retornando dados REAIS"""
from dotenv import load_dotenv
load_dotenv()

from src.services.flight_api import FlightAPIService
import os

print("=" * 60)
print("🧪 TESTE RÁPIDO - AMADEUS API")
print("=" * 60)
print()

# Verificar variáveis
api_key = os.getenv('AMADEUS_API_KEY', '')
api_secret = os.getenv('AMADEUS_API_SECRET', '')

if not api_key or api_key == 'your_amadeus_api_key_here':
    print("❌ ERRO: API Key não configurada!")
    exit(1)

print(f"✅ API Key: {api_key[:15]}...")
print(f"✅ API Secret: {'*' * 15}...")
print()

# Criar serviço
service = FlightAPIService()
print(f"✅ FlightAPIService criado")
print(f"   Modo: {service.mode}")
print(f"   Allow Fallback: {service.allow_fallback}")
print()

# Obter token
print("🔐 Obtendo token Amadeus...")
token = service.get_amadeus_token()

if not token:
    print("❌ FALHOU ao obter token!")
    exit(1)

print(f"✅ Token obtido: {token[:30]}...")
print()

# Testar busca
print("✈️  Testando busca de voos (GRU → GIG)...")
voos = service.search_flights('GRU', 'GIG', '2025-11-15', passageiros=1)

print(f"✅ Encontrados {len(voos)} voo(s)")
print()

if voos:
    print("📊 Primeiros 3 voos:")
    print("-" * 60)
    for i, voo in enumerate(voos[:3], 1):
        print(f"{i}. {voo['companhia']['nome']} - Voo {voo['voo_numero']}")
        print(f"   Preço: R$ {voo['preco_dinheiro']:.2f}")
        print(f"   Milhas: {voo['milhas_necessarias']:,}")
        print()

print("=" * 60)
print("✅ TESTE CONCLUÍDO!")
print("=" * 60)
