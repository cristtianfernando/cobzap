import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'https://cobzap.com',
  'https://www.cobzap.com',
  process.env.SITE_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.NODE_ENV !== 'production' && 'http://localhost:3000',
].filter(Boolean));

const allowedRoles = new Set([
  'Sócio Proprietário',
  'Diretor',
  'Superintendente',
  'Gerente',
  'Coordenador',
  'Supervisor',
  'Analista',
  'Outro',
]);
const allowedTeamSizes = new Set(['1 a 5', '5 a 10', '10 a 20', '20 a 50', '50 a 100', '100+']);
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const clean = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins.has(origin)) {
    return NextResponse.json({ success: false, message: 'Origem não autorizada.' }, { status: 403 });
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ success: false, message: 'Conteúdo inválido.' }, { status: 415 });
  }

  try {
    const body = await request.text();
    if (body.length > 8_192) {
      return NextResponse.json({ success: false, message: 'Conteúdo inválido.' }, { status: 413 });
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return NextResponse.json({ success: false, message: 'Conteúdo inválido.' }, { status: 400 });
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ success: false, message: 'Conteúdo inválido.' }, { status: 400 });
    }
    if (clean(data.website, 100)) {
      return NextResponse.json({ success: true, message: 'Dados salvos com sucesso!' });
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = clean(forwardedFor?.split(',')[0], 45);
    if (!ip) {
      return NextResponse.json({ success: false, message: 'Requisição inválida.' }, { status: 400 });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const clientKey = createHash('sha256').update(ip).digest('hex');
    const { data: allowed, error: rateLimitError } = await supabase.rpc('consume_lead_rate_limit', {
      p_client_key: clientKey,
      p_limit: 5,
    });

    if (rateLimitError) throw rateLimitError;
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    const nome = clean(data.nome, 100);
    const email = clean(data.email, 100).toLowerCase();
    const whatsapp = clean(data.telefone_formatado || data.telefone || data.whatsapp, 20);
    const cargo = clean(data.cargo, 100);
    const tamanhoEquipe = clean(data.tamanho_time || data.tamanho_equipe, 20);
    const phoneDigits = whatsapp.replace(/\D/g, '');

    if (
      nome.length < 2 ||
      !emailPattern.test(email) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15 ||
      !allowedRoles.has(cargo) ||
      !allowedTeamSizes.has(tamanhoEquipe)
    ) {
      return NextResponse.json({ success: false, message: 'Dados inválidos.' }, { status: 400 });
    }

    const { error } = await supabase.from('leads_captacao').insert({
      nome,
      email,
      whatsapp,
      empresa: '',
      cargo,
      tamanho_equipe: tamanhoEquipe,
      ip_usuario: ip,
      user_agent: clean(request.headers.get('user-agent'), 500),
      origem: 'gate-cobchat',
    });

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Dados salvos com sucesso!' });
  } catch (error) {
    console.error('Erro na API salvar_lead:', error);
    return NextResponse.json({ success: false, message: 'Erro ao salvar os dados.' }, { status: 500 });
  }
}
