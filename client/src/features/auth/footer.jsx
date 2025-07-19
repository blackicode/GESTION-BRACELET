import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaWhatsapp, FaGlobe } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="max-w-7xl mx-auto px-6 pl-56">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* À propos d'ENTACIG */}
                    <div>
                        <h2 className="text-xl font-semibold text-white">À propos d'ENTACIG</h2>
                        <p className="mt-2 text-sm">
                            ENTACIG (Espace Numérique et Technologie des Alertes du Centre Informatique de Gamal) est une plateforme innovante utilisant des réseaux de capteurs distribués, l’intelligence artificielle (IA) et la domotique pour assurer la sécurité des environnements.
                            Notre solution permet la surveillance en temps réel des risques environnementaux, techniques ou humains, avec des systèmes capables de détecter :
                        </p>
                        <ul className="mt-2 text-sm list-disc list-inside">
                            <li>✔ Incendies et fumées</li>
                            <li>✔ Fuites de gaz</li>
                            <li>✔ Intrusions non autorisées</li>
                            <li>✔ Températures anormales</li>
                            <li>✔ Détection de mouvement</li>
                            <li>✔ Gestion automatique des équipements électriques</li>
                            <li>✔ Notification en temps réel via SMS, Email et Application</li>
                            <li>✔ Analyse des données pour la prédiction des risques</li>
                            <li>✔ Gestion de l’énergie dans les bâtiments</li>
                            <li>✔ Système de vidéosurveillance intelligent</li>
                        </ul>
                        <p className="mt-4">
                            Grâce à une combinaison de capteurs IoT, d’algorithmes d’apprentissage automatique et de la domotique, ENTACIG permet une gestion proactive des risques et une automatisation intelligente des bâtiments.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-xl font-semibold text-white">Nous contacter</h2>
                        <p className="mt-2 text-sm flex items-center">
                            <FaEnvelope className="mr-2 text-yellow-400" />
                            <a href="mailto:contact.entacig@gmail.com" className="hover:text-yellow-400">contact.entacig@gmail.com</a>
                        </p>
                        <p className="mt-2 text-sm flex items-center">
                            <FaPhone className="mr-2 text-yellow-400" />
                            <a href="tel:+224625841482" className="hover:text-yellow-400">+224 625 84 14 82</a>
                        </p>
                        <p className="mt-2 text-sm flex items-center">
                            <FaWhatsapp className="mr-2 text-green-400" />
                            <a href="https://wa.me/224625841482" className="hover:text-green-400">WhatsApp</a>
                        </p>
                        <p className="mt-2 text-sm flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-yellow-400" />
                            <span>Conakry, Guinée</span>
                        </p>
                        <p className="mt-2 text-sm flex items-center">
                            <FaGlobe className="mr-2 text-blue-400" />
                            <a href="https://www.entacig.com" className="hover:text-blue-400">www.entacig.com</a>
                        </p>
                    </div>

                    {/* Réseaux sociaux */}
                    <div>
                        <h2 className="text-xl font-semibold text-white">Suivez-nous</h2>
                        <p className="mt-2 text-sm">
                            Rejoignez notre communauté pour suivre nos dernières avancées en **intelligence artificielle, IoT et domotique**.
                        </p>
                        <div className="flex space-x-4 mt-3">
                            <a href="https://facebook.com/entacig" className="hover:text-blue-500">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://twitter.com/entacig" className="hover:text-blue-400">
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://linkedin.com/company/entacig" className="hover:text-blue-600">
                                <FaLinkedin size={24} />
                            </a>
                            <a href="https://wa.me/224625841482" className="hover:text-green-400">
                                <FaWhatsapp size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center mt-8 border-t border-gray-700 pt-4 text-sm">
                © {new Date().getFullYear()} ENTACIG. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;