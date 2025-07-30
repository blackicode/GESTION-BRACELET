import React, { useState, useEffect, useRef } from 'react';
import { Download, Paperclip, Mic, FileText, Video, Image } from 'lucide-react';

// Configuration API
const API_BASE_URL = 'http://localhost:5000/api';

// Simulation des props de navigation (à remplacer par vos props réels)
const mockLocationState = {
  recipientId: '67890', // ID du destinataire
  recipientInfo: {
    firstName: 'Dr. Marie',
    lastName: 'Dupont',
    photo: '/default-profile.png',
    userType: 'Medecin'
  }
};

// Fonction pour récupérer le token depuis localStorage ou votre système d'auth
const getAuthToken = () => {
  // Remplacez ceci par votre méthode de récupération du token
  return localStorage.getItem('authToken') || sessionStorage.getItem('token') || 'your-jwt-token-here';
};

// Simulation des données utilisateur pour les tests (à supprimer en production)
const mockCurrentUser = {
  _id: '12345',
  firstName: 'John',
  lastName: 'Doe',
  userType: 'Patient',
  email: 'john.doe@example.com'
};

// Menu Component
const Menu = ({ isOpen, onToggle, onOptionSelect }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="p-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
    >
      ☰ Menu
    </button>
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
        {[
          { label: 'Supprimer', value: 'delete' },
          { label: 'Créer un groupe', value: 'profile', href: '/dashboard/creergroup' },
          { label: 'Paramètres', value: 'settings', href: '/dashboard/sttingmessage' },
          { label: 'Rechercher un membre', value: 'search', href: '/dashboard/rechermembre' },
          { label: 'Effacer le contenu', value: 'clear' },
          { label: 'Membres connectés', value: 'members', href: '/dashboard/connecte-members' },
          { label: 'Déconnexion', value: 'logout' }
        ].map(({ label, value, href }) => (
          <button
            key={value}
            onClick={() => onOptionSelect(value)}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
);

// Message Component
const Message = ({ msg, currentUser, onSelect, onDownload, formatDate, categorizeMessages }) => {
  const isOwnMessage = msg.sender._id === currentUser._id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs p-3 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        <span className="block text-sm font-semibold">
          {isOwnMessage ? 'Vous' : `${msg.sender.firstName} ${msg.sender.lastName} (${msg.sender.userType})`}
        </span>
        <p className="mt-1">{msg.content}</p>
        <p className="text-xs mt-1 opacity-75">{categorizeMessages(msg.createdAt)}</p>
        {msg.attachment && (
          <div className="mt-2 text-xs">
            <span>Type: {msg.attachment.fileType}</span><br />
            <span>Taille: {(msg.attachment.fileSize / 1024).toFixed(2)} KB</span><br />
            <button
              onClick={() => onDownload(msg.attachment.filePath, msg.attachment.fileName)}
              className="ml-2 text-blue-300 hover:text-blue-100"
            >
              <Download size={14} />
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs opacity-75">{formatDate(new Date(msg.createdAt))}</span>
          {isOwnMessage && (
            <span className="text-xs opacity-75">
              {msg.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// FileOptions Component
const FileOptions = ({ isOpen, onSelect }) => (
  <div className={`absolute bottom-16 right-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-48 ${isOpen ? 'block' : 'hidden'}`}>
    {[
      { label: 'Image', type: 'image/*', icon: <Image size={16} /> },
      { label: 'Audio', type: 'audio/*', icon: <Mic size={16} /> },
      { label: 'Document PDF', type: 'application/pdf', icon: <FileText size={16} /> }
    ].map(({ label, type, icon }) => (
      <button
        key={type}
        type="button"
        onClick={() => onSelect(type)}
        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
      >
        {icon} <span className="ml-2">{label}</span>
      </button>
    ))}
  </div>
);

// ConfirmationDialog Component
const ConfirmationDialog = ({ show, message, onConfirm, onCancel }) => (
  show && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Confirmer
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
);

// Main Messagerie Component
function Messagerie() {
  // Utilisation des données simulées (remplacez par vos props réels)
  const { recipientId, recipientInfo } = mockLocationState;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Récupération des informations utilisateur
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = getAuthToken();
      
      // Si pas de token, utiliser les données simulées pour les tests
      if (!token || token === 'your-jwt-token-here') {
        console.warn('Aucun token d\'authentification valide trouvé, utilisation des données de test');
        setCurrentUser(mockCurrentUser);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else if (response.status === 403) {
          console.error('Token d\'authentification invalide ou expiré');
          setError('Session expirée, veuillez vous reconnecter');
          // Rediriger vers la page de connexion
          // window.location.href = '/login';
        } else if (response.status === 401) {
          console.error('Non autorisé - Token manquant ou invalide');
          setError('Authentification requise');
        } else {
          setError('Erreur lors de la récupération des informations utilisateur');
        }
      } catch (err) {
        console.error('Erreur de connexion:', err);
        setError('Erreur de connexion au serveur');
        // En cas d'erreur de connexion, utiliser les données de test
        setCurrentUser(mockCurrentUser);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Récupération des messages de la conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipientId || !currentUser) return;

      const token = getAuthToken();
      
      // Simuler des messages pour les tests si pas de token valide
      if (!token || token === 'your-jwt-token-here') {
        const mockMessages = [
          {
            _id: '1',
            content: 'Bonjour, comment allez-vous ?',
            sender: {
              _id: '67890',
              firstName: 'Dr. Marie',
              lastName: 'Dupont',
              userType: 'Medecin'
            },
            createdAt: new Date().toISOString(),
            isRead: false
          },
          {
            _id: '2',
            content: 'Merci pour votre message, je vais bien.',
            sender: currentUser,
            createdAt: new Date(Date.now() - 300000).toISOString(),
            isRead: true
          }
        ];
        setMessages(mockMessages);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/messages/conversation/${recipientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const messagesData = await response.json();
          setMessages(messagesData);
        } else if (response.status === 403 || response.status === 401) {
          setError('Session expirée, veuillez vous reconnecter');
        } else {
          setError('Erreur lors du chargement des messages');
        }
      } catch (err) {
        console.error('Erreur de connexion:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipientId, currentUser]);

  // Récupération du nombre de messages non lus
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = getAuthToken();
      
      if (!token || token === 'your-jwt-token-here') {
        setUnreadCount(2); // Simuler des messages non lus
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount);
        } else if (response.status === 403 || response.status === 401) {
          console.error('Token invalide pour récupérer les messages non lus');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des messages non lus:', err);
      }
    };

    if (currentUser) {
      fetchUnreadCount();
    }
  }, [currentUser]);

  // Envoi d'un message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() && files.length === 0) {
      setError('Veuillez saisir un message ou sélectionner un fichier');
      return;
    }

    const token = getAuthToken();
    
    // Simuler l'envoi pour les tests
    if (!token || token === 'your-jwt-token-here') {
      const newMessage = {
        _id: Date.now().toString(),
        content: message.trim(),
        sender: currentUser,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setFiles([]);
      setError('');
      return;
    }

    try {
      const messageData = {
        recipientId,
        content: message.trim() || undefined
      };

      // Gestion des fichiers
      if (files.length > 0) {
        const file = files[0]; // Prendre seulement le premier fichier

        // Créer FormData pour l'upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipientId', recipientId);
        if (message.trim()) {
          formData.append('content', message.trim());
        }

        const response = await fetch(`${API_BASE_URL}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          setMessage('');
          setFiles([]);
          setError('');
          // Recharger les messages
          const messagesResponse = await fetch(`${API_BASE_URL}/messages/conversation/${recipientId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setMessages(messagesData);
          }
        } else if (response.status === 403 || response.status === 401) {
          setError('Session expirée, veuillez vous reconnecter');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Erreur lors de l\'envoi du message');
        }
      } else {
        // Envoi message texte uniquement
        const response = await fetch(`${API_BASE_URL}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          setMessage('');
          setError('');
          // Recharger les messages
          const messagesResponse = await fetch(`${API_BASE_URL}/messages/conversation/${recipientId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setMessages(messagesData);
          }
        } else if (response.status === 403 || response.status === 401) {
          setError('Session expirée, veuillez vous reconnecter');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Erreur lors de l\'envoi du message');
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
      setError('Erreur de connexion au serveur');
    }
  };

  // Suppression d'un message
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
        setShowConfirmation(false);
      } else {
        setError('Erreur lors de la suppression du message');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  // Marquer un message comme lu
  const handleMarkAsRead = async (messageId) => {
    try {
      await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Erreur lors du marquage comme lu');
    }
  };

  const handleFileTypeSelection = (type) => {
    setSelectedFileType(type);
    setShowOptions(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setMessage(selectedFiles.map(file => file.name).join(', '));
    setError('');
  };

  const handleLogout = () => {
    // Simulation de déconnexion
    console.log('Déconnexion simulée');
    alert('Déconnexion simulée - implémentez votre logique de navigation ici');
  };

  const handleMenuOption = (option) => {
    setShowMenu(false);
    switch (option) {
      case 'delete':
        if (selectedMessage) {
          setConfirmationAction(() => () => handleDeleteMessage(selectedMessage._id));
          setShowConfirmation(true);
        }
        break;
      case 'clear':
        setConfirmationAction(() => () => setMessages([]));
        setShowConfirmation(true);
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`;
  };

  const categorizeMessages = (msgDate) => {
    const now = new Date();
    const messageDate = new Date(msgDate);
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (messageDate.toDateString() === now.toDateString()) return "Aujourd'hui";
    if (messageDate.toDateString() === yesterday.toDateString()) return 'Hier';
    return formatDate(messageDate);
  };

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/files/${filePath}`;
    link.download = fileName;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser || !recipientId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Erreur: Informations manquantes</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={recipientInfo?.photo || '/default-profile.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="text-lg font-medium">
                {recipientInfo ? `${recipientInfo.firstName} ${recipientInfo.lastName}` : 'Destinataire'}
              </span>
              {recipientInfo && (
                <div className="text-sm text-gray-500">
                  {recipientInfo.userType}
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Menu isOpen={showMenu} onToggle={() => setShowMenu(!showMenu)} onOptionSelect={handleMenuOption} />
        </div>

        {/* Messages */}
        <div className="p-4 h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Aucun message dans cette conversation
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg._id} onClick={() => setSelectedMessage(msg)}>
                <Message
                  msg={msg}
                  currentUser={currentUser}
                  onSelect={() => setSelectedMessage(msg)}
                  onDownload={handleDownload}
                  formatDate={formatDate}
                  categorizeMessages={categorizeMessages}
                />
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="relative">
            <FileOptions isOpen={showOptions} onSelect={handleFileTypeSelection} />
            <input
              ref={fileInputRef}
              type="file"
              accept={selectedFileType}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <textarea
                name="message"
                rows="2"
                placeholder="Votre message ou choisissez des fichiers"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                disabled={!message.trim() && files.length === 0}
              >
                Envoyer
              </button>
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip className="w-6 h-6" />
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Fichier sélectionné: {files[0].name}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          show={showConfirmation}
          message="Êtes-vous sûr de vouloir effectuer cette action ?"
          onConfirm={() => {
            if (confirmationAction) {
              confirmationAction();
              setConfirmationAction(null);
            }
            setShowConfirmation(false);
          }}
          onCancel={() => {
            setShowConfirmation(false);
            setConfirmationAction(null);
          }}
        />
      </div>
    </div>
  );
}

export default Messagerie;