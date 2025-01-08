import { useState } from 'react'
import {
  PlusIcon,
  EnvelopeClosedIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons'
import UserForm from './UserForm'
import DeleteConfirmationModal from './DeleteConfirmationModal'

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'User',
      status: 'Active'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

  const handleAddUser = (formData) => {
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    }
    setUsers([...users, newUser])
    setShowAddModal(false)
  }

  const handleEditUser = (formData) => {
    const updatedUsers = users?.map(user => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        }
      }
      return user
    })
    setUsers(updatedUsers)
    setShowEditModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId) => {
    setItemToDelete({
      type: 'user',
      id: userId,
      name: users.find(u => u.id === userId)?.name
    })
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    setUsers(users?.filter(user => user.id !== itemToDelete.id))
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Users</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <div
            key={user.id}
            className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">
                {user.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <EnvelopeClosedIcon className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex gap-2">
                <span className="inline-block px-2 py-1 bg-white/5 rounded-full text-xs text-white">
                  {user.role}
                </span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  user.status === 'Active' 
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingUser(user)
                  setShowEditModal(true)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Pencil1Icon className="h-4 w-4 text-blue-400" />
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <TrashIcon className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <UserForm
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false)
            setShowEditModal(false)
            setEditingUser(null)
          }}
          onSubmit={showAddModal ? handleAddUser : handleEditUser}
          initialData={editingUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setItemToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        itemType="user"
        itemName={itemToDelete?.name}
      />
    </div>
  )
}

export default Users 