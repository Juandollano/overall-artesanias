/* Casa Over All — estructura de categorías según "CATEGORIAS PAG WEB.xlsx"
   Categoría > Subcategoría > Material o técnica.
   Para mover un producto, editá su línea en ASIGNACION ("categoria/subcategoria/material").
   Un producto puede estar en varias categorías (separadas por coma). */
window.OVERALL_CATS = (function () {
  var TEXTIL = ['ao-poi', 'ao-poi-autentico', 'encaje-ju', 'encaje-con-lienzo', 'nanduti', 'telar', '4-lisos'];

  var ARBOL = [
    { s: 'mesa-y-cocina', n: 'Mesa y cocina', img: 'img/cat-madera.jpg', subs: [
      { s: 'caminos', n: 'Caminos', m: TEXTIL },
      { s: 'individuales', n: 'Individuales', m: TEXTIL },
      { s: 'cubrepanes', n: 'Cubrepanes', m: ['ao-poi', 'ao-poi-autentico', 'encaje-ju', 'encaje-con-lienzo'] },
      { s: 'juegos-de-individuales', n: 'Juegos de individuales', m: ['ao-poi', 'encaje-ju', 'encaje-con-lienzo', 'nanduti', 'telar', '4-lisos'] },
      { s: 'servilleteros', n: 'Servilleteros', m: ['ceramica', 'telar', 'palo-santo'] },
      { s: 'carpetas', n: 'Carpetas', m: ['ao-poi', 'encaje-ju', 'encaje-con-lienzo', 'nanduti', 'telar', '4-lisos'] },
      { s: 'bowls', n: 'Bowls', m: ['cedro', 'palo-santo', 'ceramica'] },
      { s: 'cajas-de-te', n: 'Cajas de té', m: ['cedro'] },
      { s: 'fuentes', n: 'Fuentes', m: ['cedro', 'palo-santo', 'ceramica'] },
      { s: 'juegos-de-platos', n: 'Juegos de platos', m: ['cedro'] },
      { s: 'morteros', n: 'Morteros', m: ['palo-santo'] },
      { s: 'manteles', n: 'Manteles', m: ['ao-poi', 'encaje-ju', 'telar'] }
    ] },
    { s: 'deco-hogar', n: 'Deco hogar', img: 'img/cat-ceramica.jpg', subs: [
      { s: 'toallitas', n: 'Toallitas', m: ['ao-poi'] },
      { s: 'portarrollos', n: 'Portarrollos', m: ['ao-poi'] },
      { s: 'fundas-y-almohadas', n: 'Fundas y almohadas', m: ['ao-poi', 'telar', 'trapito'] },
      { s: 'cuadros-fachadas-y-platos', n: 'Cuadros, fachadas y platos', m: ['ceramica', 'madera', 'nanduti', 'indigena', 'ilustraciones'] },
      { s: 'jarrones', n: 'Jarrones', m: ['palo-santo', 'ceramica'] },
      { s: 'figuras-de-ceramica', n: 'Figuras de cerámica', m: ['mamas', 'vendedoras', 'angeles', 'musicos', 'animales'] },
      { s: 'macetas', n: 'Macetas', m: ['ceramica'] },
      { s: 'gallinitas', n: 'Gallinitas', m: ['de-la-suerte', 'ceramica-esmaltada'] },
      { s: 'cortinas', n: 'Cortinas', m: ['telar'] }
    ] },
    { s: 'cama', n: 'Cama', img: 'p:colcha-4-lisos', subs: [
      { s: 'mantas', n: 'Mantas', m: ['telar', '4-lisos', 'crochet'] },
      { s: 'pie-de-cama', n: 'Pie de cama', m: ['4-lisos', 'crochet'] }
    ] },
    { s: 'moda', n: 'Moda', img: 'img/cat-indumentaria.jpg', subs: [
      { s: 'dama', n: 'Dama', m: ['blusas', 'camisas', 'vestidos', 'remeras'] },
      { s: 'caballero', n: 'Caballero', m: ['camisas', 'guayaberas', 'chombas', 'remeras'] },
      { s: 'infantil', n: 'Infantil', m: ['camisas', 'chombas', 'remeras'] }
    ] },
    { s: 'accesorios', n: 'Accesorios', img: 'img/cat-cuero.jpg', subs: [
      { s: 'carteras', n: 'Carteras', m: ['cuero', 'telar', 'trapito', 'yicas'] },
      { s: 'bolsos', n: 'Bolsos', m: ['telar', 'trapito'] },
      { s: 'mochilas', n: 'Mochilas', m: ['cuero', 'telar', 'trapito'] },
      { s: 'billeteras', n: 'Billeteras', m: ['cuero-dama', 'cuero-caballero'] },
      { s: 'sombreros', n: 'Sombreros', m: ['jatai'] },
      { s: 'abanicos', n: 'Abanicos', m: ['nanduti', 'karanday'] },
      { s: 'necesaires', n: 'Necesaires', m: ['telar'] },
      { s: 'chalinas', n: 'Chalinas', m: ['lienzo', 'encaje-ju', 'ao-poi', 'telar'] },
      { s: 'chales', n: 'Chales', m: ['lienzo', 'encaje-ju', 'ao-poi', 'telar'] },
      { s: 'pulseras', n: 'Pulseras', m: ['hilo', 'semillas'] },
      { s: 'aros', n: 'Aros', m: ['nanduti', 'ceramica'] },
      { s: 'kepis', n: 'Kepis', m: ['tela'] },
      { s: 'cintos', n: 'Cintos', m: ['cuero'] }
    ] },
    { s: 'indigena', n: 'Indígena', img: 'p:cesto-guembepi', subs: [
      { s: 'cesteria', n: 'Cestería' }, { s: 'pantallas', n: 'Pantallas' }, { s: 'bolsos-karaguata', n: 'Bolsos de karaguata' },
      { s: 'animales', n: 'Animales' }, { s: 'instrumentos-musicales', n: 'Instrumentos musicales' }, { s: 'tapices', n: 'Tapices' }
    ] },
    { s: 'filigrana', n: 'Filigrana', img: 'img/cat-filigrana.jpg', subs: [
      { s: 'aros', n: 'Aros' }, { s: 'anillos', n: 'Anillos' }, { s: 'pulseras', n: 'Pulseras' },
      { s: 'prendedores', n: 'Prendedores' }, { s: 'sujeta-corbatas', n: 'Sujeta corbatas' }, { s: 'gemelos', n: 'Gemelos' }
    ] },
    { s: 'aromas', n: 'Aromas', img: 'p:jabon-organico', subs: [
      { s: 'velas', n: 'Velas' }, { s: 'esencias', n: 'Esencias' }, { s: 'jabones', n: 'Jabones' }
    ] },
    { s: 'souvenir', n: 'Souvenir', img: 'p:tequilero-palo-santo', subs: [
      { s: 'imanes', n: 'Imanes' }, { s: 'llaveros', n: 'Llaveros' }, { s: 'tazas', n: 'Tazas' },
      { s: 'tequileros', n: 'Tequileros' }, { s: 'ron', n: 'Ron' }, { s: 'postales', n: 'Postales' }
    ] },
    { s: 'pesebres', n: 'Pesebres', img: 'img/promo-2.png', subs: [
      { s: 'ceramica', n: 'Cerámica' }, { s: 'madera', n: 'Madera' }, { s: 'palo-santo', n: 'Palo santo' },
      { s: 'porcelanicron', n: 'Porcelanicrón' }, { s: 'hoja-de-banana', n: 'Hoja de banana' }
    ] },
    { s: 'articulos-religiosos', n: 'Artículos religiosos', img: 'p:virgen-de-caacupe-en-cedro', subs: [
      { s: 'santos', n: 'Santos' }, { s: 'virgenes', n: 'Vírgenes' }, { s: 'cruces', n: 'Cruces' },
      { s: 'mano-de-dios', n: 'Mano de Dios' }, { s: 'espiritu-santo', n: 'Espíritu Santo' }
    ] },
    { s: 'mate-y-terere', n: 'Mate y tereré', img: 'p:termo-repujado-cuero-tostado', subs: [
      { s: 'mates', n: 'Mates' }, { s: 'guampas', n: 'Guampas' }, { s: 'termos', n: 'Termos' }, { s: 'bombillas', n: 'Bombillas' },
      { s: 'portamates', n: 'Portamates' }, { s: 'yerba', n: 'Yerba' }, { s: 'mix-de-hierbas', n: 'Mix de hierbas' }
    ] },
    { s: 'hamacas', n: 'Hamacas', img: 'p:hamaca-pirayu-paraguay', subs: [
      { s: 'telar', n: 'Telar' }, { s: 'pirayu', n: 'Pirayú' }
    ] },
    { s: 'regalos-empresariales', n: 'Regalos empresariales', img: 'img/promo-1.jpg', subs: [
      { s: 'kits', n: 'Kits' }
    ] },
    { s: 'navidad', n: 'Navidad', img: 'p:regalo-navidad-de-flor-de-coco', subs: [
      { s: 'pesebres', n: 'Pesebres' }, { s: 'adornos', n: 'Adornos' }
    ] }
  ];

  var MATERIALES = {
    'ao-poi': "Ao po'i", 'ao-poi-autentico': "Ao po'i auténtico", 'encaje-ju': 'Encaje ju', 'encaje-con-lienzo': 'Encaje con lienzo',
    'nanduti': 'Ñandutí', 'telar': 'Telar', '4-lisos': '4 lisos', 'ceramica': 'Cerámica', 'ceramica-esmaltada': 'Cerámica esmaltada',
    'palo-santo': 'Palo santo', 'cedro': 'Cedro', 'madera': 'Madera', 'indigena': 'Indígena', 'ilustraciones': 'Ilustraciones',
    'mamas': 'Mamitas', 'vendedoras': 'Vendedoras', 'angeles': 'Ángeles', 'musicos': 'Músicos', 'animales': 'Animales',
    'de-la-suerte': 'De la suerte', 'trapito': 'Trapito', 'crochet': 'Crochet', 'blusas': 'Blusas', 'camisas': 'Camisas',
    'vestidos': 'Vestidos', 'remeras': 'Remeras', 'guayaberas': 'Guayaberas', 'chombas': 'Chombas', 'cuero': 'Cuero',
    'yicas': 'Yicas', 'cuero-dama': 'Cuero dama', 'cuero-caballero': 'Cuero caballero', 'jatai': "Jata'i", 'karanday': 'Karanday',
    'lienzo': 'Lienzo', 'hilo': 'Hilo', 'semillas': 'Semillas', 'tela': 'Tela', 'karaguata': 'Karaguata'
  };

  // Producto (slug) -> rutas "categoria/subcategoria/material". Los pesebres se agregan también a Navidad automáticamente.
  var ASIGNACION = {
    // Mesa y cocina
    'caminero-ao-poi-ysypo-y-borde-de-crochet': 'mesa-y-cocina/caminos/ao-poi',
    'caminero-ao-poi-encaje-fino': 'mesa-y-cocina/caminos/ao-poi',
    'caminero-ao-poi-autentico': 'mesa-y-cocina/caminos/ao-poi-autentico',
    'caminero-ao-poi-autentico-con-encaje': 'mesa-y-cocina/caminos/ao-poi-autentico',
    'caminero-encaje-ju': 'mesa-y-cocina/caminos/encaje-ju',
    'caminero-encaje-ju-especial': 'mesa-y-cocina/caminos/encaje-ju',
    'caminero-lienzo-y-encaje-ju': 'mesa-y-cocina/caminos/encaje-con-lienzo',
    'caminero-lienzo-y-encaje-ju-especial': 'mesa-y-cocina/caminos/encaje-con-lienzo',
    'caminero-4-lisos-corto': 'mesa-y-cocina/caminos/4-lisos',
    'individual-encaje-ju': 'mesa-y-cocina/individuales/encaje-ju',
    'individual-encaje-ju-grueso': 'mesa-y-cocina/individuales/encaje-ju',
    'individual-encaje-ju-flor-chica': 'mesa-y-cocina/individuales/encaje-ju',
    'individual-nanduti': 'mesa-y-cocina/individuales/nanduti',
    'cubre-pan-ao-poi': 'mesa-y-cocina/cubrepanes/ao-poi',
    'cubre-pan-ao-poi-encaje-fino': 'mesa-y-cocina/cubrepanes/ao-poi',
    'juego-de-individuales-ao-poi': 'mesa-y-cocina/juegos-de-individuales/ao-poi',
    'juego-de-individuales-pilar': 'mesa-y-cocina/juegos-de-individuales/telar',
    'juego-de-individuales-telar': 'mesa-y-cocina/juegos-de-individuales/telar',
    'carpeta-nanduti-redondo': 'mesa-y-cocina/carpetas/nanduti',
    'carpeta-nanduti': 'mesa-y-cocina/carpetas/nanduti',
    'bowl-palo-santo': 'mesa-y-cocina/bowls/palo-santo',
    'bowl-con-tapa-palo-santo': 'mesa-y-cocina/bowls/palo-santo',
    'frutera-de-cedro': 'mesa-y-cocina/fuentes/cedro',
    'fuente-3-bachas-cedro': 'mesa-y-cocina/fuentes/cedro',
    'juegos-de-platos': 'mesa-y-cocina/juegos-de-platos/cedro',
    'mortero-palo-santo': 'mesa-y-cocina/morteros/palo-santo',
    'mantel-ao-poi-bordado-vainilla-palito-con-borde-crochet': 'mesa-y-cocina/manteles/ao-poi',
    'mantel-ao-poi-autentico': 'mesa-y-cocina/manteles/ao-poi-autentico',
    'mantel-encaje-ju': 'mesa-y-cocina/manteles/encaje-ju',
    'mantel-encaje-ju-especial': 'mesa-y-cocina/manteles/encaje-ju',
    'mantel-lienzo-y-encaje-ju': 'mesa-y-cocina/manteles/encaje-con-lienzo',
    'mantel-nanduti': 'mesa-y-cocina/manteles/nanduti',
    'cuchara-mini-ceramica-esmaltada': 'mesa-y-cocina',
    // Deco hogar
    'toallita-ao-poi-encaje': 'deco-hogar/toallitas/ao-poi',
    'toallita-ao-poi-con-crochet': 'deco-hogar/toallitas/ao-poi',
    'funda-encaje-ju': 'deco-hogar/fundas-y-almohadas/encaje-ju',
    'fachada-colonial-ceramica-ladrillo': 'deco-hogar/cuadros-fachadas-y-platos/ceramica',
    'cuadro-de-ceramica-esmaltada-en-caja': 'deco-hogar/cuadros-fachadas-y-platos/ceramica, regalos-empresariales/kits',
    'cuadro-de-madera-tallada-en-caja': 'deco-hogar/cuadros-fachadas-y-platos/madera, regalos-empresariales/kits',
    'cuadro-de-nanduti': 'deco-hogar/cuadros-fachadas-y-platos/nanduti, regalos-empresariales/kits',
    'cuadro-con-ilustracion': 'deco-hogar/cuadros-fachadas-y-platos/ilustraciones, regalos-empresariales/kits',
    'jarron-palo-santo': 'deco-hogar/jarrones/palo-santo',
    'mamita-en-ceramica': 'deco-hogar/figuras-de-ceramica/mamas',
    'gallinita-de-la-suerte-en-ceramica': 'deco-hogar/gallinitas/de-la-suerte',
    'gallina-ceramica-esmaltada': 'deco-hogar/gallinitas/ceramica-esmaltada',
    // Cama
    'colcha-hilo-fino-telar': 'cama/mantas/telar',
    'colcha-telar-hilo-grueso': 'cama/mantas/telar',
    'colcha-poyvi-a-rayas': 'cama/mantas/telar',
    'colcha-4-lisos': 'cama/mantas/4-lisos',
    // Moda
    'camisa-manga-3-4-ao-poi': 'moda/dama/blusas',
    'blusa-manga-3-4-lino': 'moda/dama/blusas',
    'camisa-manga-corta-oxford': 'moda/caballero/camisas',
    'camisa-manga-corta-bordado-nido': 'moda/caballero/camisas',
    'camisa-manga-corta-ao-poi': 'moda/caballero/camisas',
    'camisa-manga-larga-ao-poi': 'moda/caballero/camisas',
    'guayabera-ao-poi': 'moda/caballero/guayaberas',
    'chomba-cuello-mao-ao-poi': 'moda/caballero/chombas',
    'chomba-cuello-mao-lynette': 'moda/caballero/chombas',
    'camisa-nino-manga-corta-ao-poi': 'moda/infantil/camisas',
    'chomba-nino-manga-corta-lynette': 'moda/infantil/chombas',
    'blusa-nina-lynette': 'moda/infantil/blusas',
    'vestido-ao-poi': 'moda/infantil/vestidos',
    // Accesorios
    'cartera-grande': 'accesorios/carteras/cuero',
    'bandolera-pequena': 'accesorios/carteras/cuero',
    'portanotebook-en-telar': 'accesorios/bolsos/telar',
    'mochila-en-cuero': 'accesorios/mochilas/cuero',
    'billetera-larga-mujer': 'accesorios/billeteras/cuero-dama',
    'billetera-larga-con-cierre-mujer': 'accesorios/billeteras/cuero-dama',
    'billetera-para-cabellero': 'accesorios/billeteras/cuero-caballero',
    'abanico-nanduti': 'accesorios/abanicos/nanduti',
    'neceser-pilar': 'accesorios/necesaires/telar',
    'chalina-de-lienzo-y-encaje-ju-angosta': 'accesorios/chalinas/lienzo',
    'chalina-de-lienzo-y-encaje-ju-ancha': 'accesorios/chalinas/lienzo',
    'panuelo-la-garra-guarani': 'accesorios/chalinas',
    'chal-lienzo-bordado': 'accesorios/chales/lienzo',
    'chal-encaje-ju': 'accesorios/chales/encaje-ju',
    'chal-ao-poi-autentico': 'accesorios/chales/ao-poi',
    'estola-de-nanduti': 'accesorios/chales/nanduti',
    'cinto-de-fibra-de-karaguata': 'accesorios/cintos/karaguata',
    // Indígena
    'cesto-guembepi': 'indigena/cesteria',
    'pantalla-karanday': 'indigena/pantallas',
    'cartera-karaguata': 'indigena/bolsos-karaguata',
    // Filigrana
    'aro-filigrana-en-plata-modelo-antiguo': 'filigrana/aros',
    'anillo-7-ramales-de-filigrana-de-plata': 'filigrana/anillos',
    'sujeta-corbata-de-filigrana-en-plata': 'filigrana/sujeta-corbatas',
    'gemelos-de-filigrana-en-plata': 'filigrana/gemelos',
    'cadena-de-plata-con-dije-de-filigrana-de-plata': 'filigrana',
    // Aromas
    'jabon-organico': 'aromas/jabones',
    // Souvenir
    'llavero-de-cuero': 'souvenir/llaveros',
    'tacita-con-plato': 'souvenir/tazas',
    'tequilero-palo-santo': 'souvenir/tequileros',
    // Pesebres
    'pesebre-ceramica': 'pesebres/ceramica', 'pesebre-estilo-moderno': 'pesebres/ceramica', 'sagrada-familia-angel': 'pesebres/ceramica',
    'pesebre-en-ceramica-con-base': 'pesebres/ceramica', 'pesebre-en-ceramica-2': 'pesebres/ceramica', 'pesebre-en-ceramica': 'pesebres/ceramica',
    'pesebre-en-lienzo-con-base': 'pesebres/ceramica', 'pesebre-en-lienzo-2': 'pesebres/ceramica', 'pesebre-en-lienzo': 'pesebres/ceramica',
    'pesebre-velero-en-ceramica': 'pesebres/ceramica', 'pesebre-gordo-sagrada-familia': 'pesebres/ceramica',
    'pesebre-ceramica-gordito-con-base': 'pesebres/ceramica', 'pesebre-en-ceramica-sagrada-familia': 'pesebres/ceramica',
    'pesebre-angel-gordito': 'pesebres/ceramica', 'pesebre-angel-gordito-2': 'pesebres/ceramica',
    'pesebre-en-ceramica-gordito': 'pesebres/ceramica', 'pesebre-en-ceramica-gordito-2': 'pesebres/ceramica',
    'pesebre-en-ceramica-gordito-3': 'pesebres/ceramica', 'pesebre-ceramica-gordito': 'pesebres/ceramica',
    'pesebre-madera-pintada': 'pesebres/madera', 'pesebre-madera-pintada-2': 'pesebres/madera', 'pesebre-madera-pintada-3': 'pesebres/madera',
    'pesebre-indigena-madera-pintada': 'pesebres/madera', 'pesebre-trompo': 'pesebres/madera', 'pesebre-campesino': 'pesebres/madera',
    'pesebre-campesino-2': 'pesebres/madera', 'pesebre-campesino-3': 'pesebres/madera', 'pesebre-campesino-sombrero-piri': 'pesebres/madera',
    'pesebre-de-madera-popular': 'pesebres/madera', 'pesebre-de-madera-popular-2': 'pesebres/madera',
    'pesebre-costumbrista-paraguayito': 'pesebres/madera', 'pesebre-costumbrista-paraguayito-2': 'pesebres/madera',
    'pesebre-madera-pintada-con-base-casita': 'pesebres/madera',
    'pesebre-mate-palo-santo': 'pesebres/palo-santo', 'pesebre-triptico-palo-santo': 'pesebres/palo-santo',
    'pesebre-porcelana-fria-con-base': 'pesebres/porcelanicron',
    'pesebre-hoja-de-banana-5-piezas': 'pesebres/hoja-de-banana', 'pesebre-en-hoja-de-banano-con-base': 'pesebres/hoja-de-banana',
    'pesebre-en-hoja-de-banano-2': 'pesebres/hoja-de-banana',
    // Artículos religiosos
    'virgen-de-caacupe-en-cedro': 'articulos-religiosos/virgenes',
    'virgen-de-caacupe-estilo-tradicional': 'articulos-religiosos/virgenes',
    'virgen-de-caacupe-palo-santo': 'articulos-religiosos/virgenes',
    'mano-de-dios-palo-santo': 'articulos-religiosos/mano-de-dios',
    'espiritu-santo-en-cedro': 'articulos-religiosos/espiritu-santo',
    'espiritu-santo-estilo-antiguo': 'articulos-religiosos/espiritu-santo',
    'espiritu-santo-con-base-cedro-pintado': 'articulos-religiosos/espiritu-santo',
    // Mate y tereré
    'mate-palo-santo': 'mate-y-terere/mates',
    'guampa-palo-santo': 'mate-y-terere/guampas',
    'termo-mate-cuero-forrado': 'mate-y-terere/termos',
    'termo-frio-calor-cuero-repujado': 'mate-y-terere/termos',
    'termo-frio-calor': 'mate-y-terere/termos',
    'termo-repujado-cuero-tostado': 'mate-y-terere/termos',
    // Hamacas
    'hamaca-sencilla-telar-natural': 'hamacas/telar', 'hamaca-pilar-con-fleco-especial': 'hamacas/telar',
    'hamaca-de-telar-vainillada': 'hamacas/telar', 'hamaca-telar-hilo-fino': 'hamacas/telar',
    'hamaca-pirayu-con-flecos': 'hamacas/telar', 'hamaca-telar-fleco-medio': 'hamacas/telar', 'hamaca-sillon-sin-espuma': 'hamacas/telar',
    'hamaca-pirayu-paraguay': 'hamacas/pirayu', 'hamaca-pirayu-especial': 'hamacas/pirayu',
    'hamaca-pirayu-tiras': 'hamacas/pirayu', 'hamaca-pirayu': 'hamacas/pirayu',
    // Regalos empresariales
    'canasta-terere': 'regalos-empresariales/kits', 'regalo-navidad-de-flor-de-coco': 'regalos-empresariales/kits',
    'regalo-manta': 'regalos-empresariales/kits', 'canasta-palo-santo': 'regalos-empresariales/kits',
    'canasta-de-verano': 'regalos-empresariales/kits', 'regalo-cocido': 'regalos-empresariales/kits',
    'caja-matera': 'regalos-empresariales/kits', 'canasta-fina': 'regalos-empresariales/kits',
    'caja-emperatriz': 'regalos-empresariales/kits', 'camino-de-encaje-ju-en-caja': 'regalos-empresariales/kits',
    'heterei': 'regalos-empresariales/kits', 'canasta-santa-mandioca': 'regalos-empresariales/kits, mesa-y-cocina/caminos/encaje-ju',
    'canasta-aromas-del-paraguay': 'regalos-empresariales/kits', 'canasta-guyra': 'regalos-empresariales/kits',
    'canasta-encaje-ju': 'regalos-empresariales/kits', 'regalo-yerba-y-yuyo': 'regalos-empresariales/kits',
    'regalo-sagradafamilia': 'regalos-empresariales/kits'
  };

  return { arbol: ARBOL, materiales: MATERIALES, asignacion: ASIGNACION };
})();
