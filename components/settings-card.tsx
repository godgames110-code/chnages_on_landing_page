"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function SettingsCard() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Configurações de Notificações</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações por E-mail</Label>
              <p className="text-sm text-muted-foreground">Receber atualizações por e-mail sobre suas transações</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alertas de Transações</Label>
              <p className="text-sm text-muted-foreground">Receber notificação quando fizer uma transação</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Relatórios Semanais</Label>
              <p className="text-sm text-muted-foreground">Receber resumo semanal das suas finanças</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alertas de Orçamento</Label>
              <p className="text-sm text-muted-foreground">Receber alerta ao aproximar-se dos limites do orçamento</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
  <h2 className="text-xl font-semibold text-foreground mb-6">Segurança</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="space-y-0.5">
              <Label className="text-base">Senha</Label>
              <p className="text-sm text-muted-foreground">Última alteração há 3 meses</p>
            </div>
            <Button variant="outline" size="sm">
              Alterar Senha
            </Button>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="space-y-0.5">
              <Label className="text-base">Autenticação de Dois Fatores</Label>
              <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
            </div>
            <Button variant="outline" size="sm">
              Habilitar
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sessões Ativas</Label>
              <p className="text-sm text-muted-foreground">Gerencie suas sessões ativas</p>
            </div>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-destructive p-6">
        <h2 className="text-xl font-semibold text-destructive mb-2">Área de Risco</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Ações irreversíveis que afetarão permanentemente sua conta
        </p>
        <Button variant="destructive" size="sm">
          Excluir Conta
        </Button>
      </div>
    </div>
  )
}
