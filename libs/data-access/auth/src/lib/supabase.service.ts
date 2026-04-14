import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase.config';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private config = inject(SUPABASE_CONFIG);

  readonly client: SupabaseClient = createClient(
    this.config.supabaseUrl,
    this.config.supabaseAnonKey,
  );
}
