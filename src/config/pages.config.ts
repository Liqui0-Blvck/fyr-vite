export const appPages = {
	mainAppPages: {
		id: 'main',
		to: '/app/home',
		text: 'Home',
	},
	registroAppPages: {
		id: 'registros',
		to: '/app/clientes',
		text: 'Registros',
		icon: 'DuoBook',
		subPages: {
			clientes: {
				id: 'clientes',
				to: '/app/clientes/',
				text: 'Clientes',
				icon: 'DuoUser'
			},
			productores: {
				id: 'productores',
				to: '/app/productores/',
				text: 'Productores',
				icon: 'DuoBriefcase'
			},
			camiones: {
				id: 'camiones',
				to: '/app/camiones/',
				text: 'Camiones',
				icon: 'HeroTruck'
			},
			conductores: {
				id: 'conductores',
				to: '/app/conductores/',
				text: 'Conductores',
				icon: 'HeroUser'
			},
			comercializadores: {
				id: 'comercializadores',
				to: '/app/comercializadores/',
				text: 'Comercializadores',
				icon: 'HeroUser'
			},
			operarios: {
				id: 'operarios',
				to: '/app/operarios/',
				text: 'Operarios',
				icon: 'HeroUser'
			}
		}
	},
	recepcionAppPages: {
		id: 'recepcionmp',
		text: 'Recepciones',
		icon: 'DuoBook',
		subPages: {
			recepcionMp: {
				id: 'recepcionmp',
				text: 'Recepcion MP',
				to: '/app/recepcionmp/',
				icon: 'HeroListBullet',
			},
			envases: {
				id: 'envases',
				text: 'Envases',
				to: '/app/envases/',
				icon: 'HeroArchiveBox',
			}
		}
	},
	controles_calidad: {
		id: 'controles_calidad',
		text: 'Control Calidad',
		icon: 'DuoBook',
		subPages: {
			recepcion: {
				id: 'cc_recepcionmp',
				text: 'CC Recepcion MP',
				icon: 'DuocBook',
				subPages: {
					controlCalidad: {
						id: 'control_calidad',
						text: 'Ctrl Calidad',
						to: '/app/control-calidad/',
						icon: 'HeroArchiveBox',
					},
					control_calidad_vb: {
						id: 'vb_control_rendimiento',
						text: 'VB Control Rendimiento',
						to: '/app/vb_control/',
						icon: 'HeroArchiveBox',
					},
					proyeccion: {
						id: 'proyeccion-furta',
						text: 'Proyeccion Fruta',
						to: '/app/proyeccion-fruta/',
						icon: 'HeroArchiveBox',
					},
				}
			},
			produccion: {
				id: 'control_calidad_produccion',
				text: 'CC Producción',
				icon: 'DuoBook',
				subPages: {
					produccion: {
						id: 'cc_tarja_resultante_produccion',
						text: 'CC Tarja Producción',
						icon: 'HeroArchiveBox',
						to: '/app/tarjas-cc'
					},
					reproceso: {
						id: 'cc_tarja_resultante_reproceso',
						text: 'CC Tarja Reproceso',
						icon: 'HeroArchiveBox',
						to: '/app/tarjas-cc-reproceso'
					}
				}
			},
			seleccion: {
				id: 'control_calidad_seleccion',
				text: 'CC Selección',
				icon: 'DuoBook',
				subPages: {
					seleccion: {
						id: 'cc_tarja_seleccion',
						text: 'CC Tarja Selección',
						icon: 'HeroArchiveBox',
						to: '/app/tarja-cc-seleccion'
					}
				}
			}
		}
	},
	produccion: {
		id: 'produccion',
		text: 'Producción',
		icon: 'DuoBook',
		subPages: {
			p_produccion: {
				id: 'programa',
				text: 'Programa Producción',
				to: '/app/produccion/',
				icon: 'HeroListBullet',
			},
			reproceso: {
				id: 'reproceso',
				text: 'Programa Reproceso',
				to: '/app/programa-reproceso/',
				icon: 'HeroListBullet',
			},
			seleccion: {
				id: 'seleccion',
				text: 'Programa Selección',
				icon: 'HeroListBullet',
				subPages: {
					programa_seleccion: {
						id: 'proceso_seleccion',
						text: 'Proceso Selección',
						to: '/app/programa-seleccion',
						icon: 'HeroListBullet',
					},
					bins_subproducto_operario: {
						id: 'bins_subprducto_operario',
						text: 'Bins Sub Producto Operario',
						to: '/app/bins-sub-producto-operario',
						icon: 'HeroListBullet'
					},
					bins_subproducto: {
						id: 'bins_subproduto',
						text: 'Bins Sub Producto',
						to: '/app/bins-subproducto',
						icon: 'HeroListBullet'
					}
				}

			}
		}
	},
	bodega: {
		id: 'bodega',
		text: 'Bodega',
		icon: 'DuoBook',
		subPages: {
			stock_bodega: {
				id: 'bodega',
				text: 'Bodega',
				to: '/app/bodega/',
				icon: 'HeroListBullet',
			},
			lotes: {
				id: 'lotes',
				text: 'Lotes ',
				to: '/app/lotes-mp',
				icon: 'HeroListBullet',
			},
			bodegas: {
				id: 'bodegas',
				text: 'Bodegas',
				icon: 'HeroListBullet',
				subPages: {
					bodega_g1: {
						id: 'bodega_g1',
						text: 'Bodega G1',
						to: '/app/bodega-g1/',
						icon: 'HeroListBullet',
					},
					bodega_g2: {
						id: 'bodega_g2',
						text: 'Bodega G2',
						to: '/app/bodega-g2/',
						icon: 'HeroListBullet',
					},
					bodega_g3: {
						id: 'bodega_g3',
						text: 'Bodega G3',
						to: '/app/bodega-g3/',
						icon: 'HeroListBullet',
					},
					bodega_g4: {
						id: 'bodega_g4',
						text: 'Bodega G4',
						to: '/app/bodega-g4/',
						icon: 'HeroListBullet',
					},
					bodega_g5: {
						id: 'bodega_g5',
						text: 'Bodega G5',
						to: '/app/bodega-g5/',
						icon: 'HeroListBullet',
					},
					bodega_g6: {
						id: 'bodega_g6',
						text: 'Bodega G6',
						to: '/app/bodega-g6/',
						icon: 'HeroListBullet',
					},
					bodega_g7: {
						id: 'bodega_g7',
						text: 'Bodega G7',
						to: '/app/bodega-g7/',
						icon: 'HeroListBullet',
					},

				}
			},
			acciones: {
				id: 'acciones',
				text: 'Acciones Bodega',
				icon: 'HeroListBullet',
				subPages: {
					transferencias: {
						id: 'transferencia_g5',
						text: 'Transferencia Bins a G5',
						to: '/app/transferencia-G5/',
						icon: 'HeroListBullet',
					},
					fumigacion: {
						id: 'fumigacion',
						text: 'Fumigación Bins',
						to: '/app/fumigacion-bins/',
						icon: 'HeroListBullet',
					},
					agrupacion_bin: {
						id: 'agrupacion',
						text: 'Agrupación Bins',
						to: '/app/agrupaciones/',
						icon: 'HeroListBullet',
					},
					inventario_bodega: {
						id: 'inventario',
						text: 'Inventario Bodegas',
						to: '/app/inventario-bodega/',
						icon: 'HeroListBullet',
					}
				}
			}

	},
	}
}

export const componentsPages = {
};

export const authPages = {
	loginPage: {
		id: 'loginPage',
		to: '/login',
		text: 'Login',
		icon: 'HeroArrowRightOnRectangle',
	},
	profilePage: {
		id: 'profilePage',
		to: '/profile',
		text: 'Perfil',
		icon: 'HeroUser',
	},
	restorePage: {
		id: 'restoreAccount',
		to: '/restore-account',
		text: 'Restore Account',
		icon: 'HeroArrowPath'
	}
};

const pagesConfig = {
	...authPages,
};

export default pagesConfig;
