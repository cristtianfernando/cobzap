-- Criação da tabela para armazenar os dados do formulário de captação (Supabase / Postgres)
CREATE TABLE IF NOT EXISTS public.leads_captacao (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    empresa VARCHAR(100),
    cargo VARCHAR(100) NOT NULL,
    tamanho_equipe VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMPTZ DEFAULT now(),
    ip_usuario VARCHAR(45),
    user_agent TEXT,
    origem VARCHAR(100) DEFAULT 'site_cobzap'
);

ALTER TABLE public.leads_captacao ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.leads_captacao FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.leads_captacao_id_seq FROM anon, authenticated;
GRANT INSERT ON TABLE public.leads_captacao TO service_role;
GRANT USAGE ON SEQUENCE public.leads_captacao_id_seq TO service_role;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

CREATE TABLE IF NOT EXISTS private.lead_rate_limits (
    client_key TEXT NOT NULL,
    window_started_at TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (client_key, window_started_at)
);

ALTER TABLE private.lead_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.lead_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE private.lead_rate_limits TO service_role;

CREATE INDEX IF NOT EXISTS idx_lead_rate_limits_window
    ON private.lead_rate_limits(window_started_at);

CREATE OR REPLACE FUNCTION public.consume_lead_rate_limit(p_client_key TEXT, p_limit INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    allowed BOOLEAN;
    current_window TIMESTAMPTZ := date_trunc('hour', now());
BEGIN
    INSERT INTO private.lead_rate_limits AS limits (client_key, window_started_at)
    VALUES (p_client_key, current_window)
    ON CONFLICT (client_key, window_started_at)
    DO UPDATE SET request_count = limits.request_count + 1
    RETURNING request_count <= p_limit INTO allowed;

    DELETE FROM private.lead_rate_limits
    WHERE window_started_at < current_window - INTERVAL '24 hours';

    RETURN allowed;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_lead_rate_limit(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_lead_rate_limit(TEXT, INTEGER) TO service_role;

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads_captacao(email);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON public.leads_captacao(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_data_cadastro ON public.leads_captacao(data_cadastro);

-- id: identificador único do registro
-- nome: nome completo do lead
-- email: endereço de e-mail do lead
-- whatsapp: número de WhatsApp do lead
-- empresa: empresa do lead
-- cargo: cargo do lead na empresa
-- tamanho_equipe: tamanho da equipe (1 a 5, 5 a 10, 10 a 20, 20 a 50, 50 a 100, 100+)
-- data_cadastro: data e hora do cadastro
-- ip_usuario: endereço IP do usuário no momento do cadastro
-- user_agent: informações do navegador/dispositivo do usuário
-- origem: origem do lead
