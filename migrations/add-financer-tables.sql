-- AKASHA AI — Tables /financer
-- Tables: aides + dossiers_financement

-- Aides disponibles (seed 45 aides francaises)
CREATE TABLE IF NOT EXISTS akasha_ai.aides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type_aide TEXT NOT NULL CHECK (type_aide IN ('particulier', 'entreprise', 'association')),
  profil_eligible TEXT[] DEFAULT '{}',
  situation_eligible TEXT[] DEFAULT '{}',
  montant_max NUMERIC(10,2) DEFAULT 0,
  taux_remboursement INTEGER DEFAULT 100,
  url_officielle TEXT,
  description TEXT,
  region TEXT DEFAULT 'national',
  handicap_only BOOLEAN DEFAULT false,
  cumulable BOOLEAN DEFAULT true,
  renouvellement_auto BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dossiers de financement des utilisateurs
CREATE TABLE IF NOT EXISTS akasha_ai.dossiers_financement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  aide_id UUID REFERENCES akasha_ai.aides(id) ON DELETE CASCADE,
  statut TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'accepte', 'refuse', 'renouveler')),
  profil_type TEXT,
  situation TEXT,
  departement TEXT,
  handicap BOOLEAN DEFAULT false,
  pdf_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE akasha_ai.aides ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.dossiers_financement ENABLE ROW LEVEL SECURITY;

-- Aides: tout le monde peut lire
CREATE POLICY "aides_select_all" ON akasha_ai.aides FOR SELECT USING (true);

-- Dossiers: chaque user voit les siens
CREATE POLICY "dossiers_select_own" ON akasha_ai.dossiers_financement FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "dossiers_insert_own" ON akasha_ai.dossiers_financement FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dossiers_update_own" ON akasha_ai.dossiers_financement FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_dossiers_user_id ON akasha_ai.dossiers_financement(user_id);
CREATE INDEX IF NOT EXISTS idx_aides_type ON akasha_ai.aides(type_aide);
CREATE INDEX IF NOT EXISTS idx_aides_active ON akasha_ai.aides(active);
