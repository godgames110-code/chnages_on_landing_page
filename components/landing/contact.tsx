"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

const contactInfo = [
	{
		icon: Phone,
		title: "Telefone",
		content: "(45) 99838-2953",
		href: "tel:+5545998382953",
	},
	{
		icon: Mail,
		title: "E-mail",
		content: "imperialarcondicionado.foz@gmail.com",
		href: "mailto:imperialarcondicionado.foz@gmail.com",
	},
	{
		icon: MapPin,
		title: "Endereço",
		content: "Foz do Iguaçu - PR",
		href: "#",
	},
	{
		icon: Clock,
		title: "Horário",
		content: "Segunda a Segunda",
		href: "#",
	},
]

export function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const whatsappMessage = `Olá! Me chamo ${formData.name}.%0A%0ATelefone: ${formData.phone}%0AE-mail: ${formData.email}%0A%0AMensagem: ${formData.message}`
		window.open(
			`https://wa.me/5545998382953?text=${whatsappMessage}`,
			"_blank"
		)
	}

	return (
		<section id="contato" className="py-24 bg-background overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
						Entre em Contato
					</h2>
					<p className="text-lg text-muted-foreground">
						Estamos prontos para atender você. Preencha o formulário ou utilize
						um de nossos canais de comunicação.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12">
					<div className="space-y-6 min-w-0">
						<div className="grid sm:grid-cols-2 gap-4">
							{contactInfo.map((info, index) => (
								<Card key={index} className="border-border/50 overflow-hidden">
									<CardContent className="p-4 sm:p-6">
										<a
											href={info.href}
											className="flex items-start gap-3 group"
										>
											<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
												<info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
											</div>
											<div className="min-w-0 flex-1 overflow-hidden">
												<p className="font-semibold text-foreground text-sm sm:text-base">
													{info.title}
												</p>
												<p className="text-muted-foreground text-xs sm:text-sm break-all">
													{info.content}
												</p>
											</div>
										</a>
									</CardContent>
								</Card>
							))}
						</div>

						<Card className="border-border/50 overflow-hidden">
							<CardContent className="p-0">
								<div className="w-full aspect-video md:aspect-auto md:h-50">
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57718.77778888889!2d-54.58806!3d-25.5163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6909f1b6b1b1b%3A0x3b5b5b5b5b5b5b5b!2sFoz%20do%20Igua%C3%A7u%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1234567890"
										width="100%"
										height="100%"
										style={{ border: 0 }}
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										title="Localização Imperial Ar Condicionado"
									/>
								</div>
							</CardContent>
						</Card>
					</div>

					<Card className="border-border/50 overflow-hidden">
						<CardContent className="p-4 sm:p-8">
							<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-6">
								Solicite um Orçamento
							</h3>
							<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-foreground mb-2"
									>
										Nome Completo
									</label>
									<Input
										id="name"
										placeholder="Seu nome"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div className="grid sm:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-foreground mb-2"
										>
											E-mail
										</label>
										<Input
											id="email"
											type="email"
											placeholder="seu@email.com"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<label
											htmlFor="phone"
											className="block text-sm font-medium text-foreground mb-2"
										>
											Telefone
										</label>
										<Input
											id="phone"
											type="tel"
											placeholder="(00) 00000-0000"
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
											required
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium text-foreground mb-2"
									>
										Mensagem
									</label>
									<Textarea
										id="message"
										placeholder="Descreva o serviço que você precisa..."
										rows={4}
										value={formData.message}
										onChange={(e) =>
											setFormData({ ...formData, message: e.target.value })
										}
										required
									/>
								</div>
								<Button type="submit" className="w-full" size="lg">
									<Send className="mr-2 h-5 w-5" />
									Enviar Mensagem
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	)
}
