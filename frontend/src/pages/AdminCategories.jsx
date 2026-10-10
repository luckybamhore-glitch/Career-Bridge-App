import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import adminService from '../services/adminService';
import { useEffect, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { removeCategoryFromList, setAdminData } from '../features/admin/adminSlice';
import toast from 'react-hot-toast';
import CategoryForm from '../components/CategoryForm';


export default function AdminCategories() {


  const [showForm , setShowForm] = useState(false)
  const [editingCategory , setEditingCategory] = useState(null)
  const [deleteId , setDeleteId] = useState(null)

  const dispatch = useDispatch()

  const {user} = useSelector(state => state.auth)
  const {categories} = useSelector(state => state.admin)

  const { data , isLoading , isError ,isSuccess ,error}  = useQuery({queryKey : ["admin"] , queryFn : ()=> adminService.fetchAdminOverview(user.token)})

  const deleteMutation = useMutation({mutationFn : (cid)=> adminService.deleteCategory({ token : user.token , cid })})

const handleShowForm = ()=> {
  setShowForm(!showForm)
  if (showForm) setEditingCategory(null)
}

const handleEdit = (cat) => {
  setEditingCategory(cat)
  setShowForm(true)
}

const handleDelete = (cid) => {
  setDeleteId(cid)
  deleteMutation.mutate(cid)
}

useEffect(() => {

  if(isSuccess){
    dispatch(setAdminData(data))
    }
  if(isError && error) {
    toast.error(error , {position : "top-center"})
  }

} , [data , isSuccess , isError , error])


useEffect(() => {
  if (deleteMutation.isSuccess && deleteMutation.data) {
    dispatch(removeCategoryFromList(deleteMutation.data._id || deleteId))
    toast.success("Category deleted")
    deleteMutation.reset()
    setDeleteId(null)
  }
  if (deleteMutation.isError && deleteMutation.error) {
    toast.error(
      deleteMutation.error?.response?.data?.message ||
      deleteMutation.error?.message ||
      "Delete failed"
    )
    setDeleteId(null)
  }
} , [deleteMutation.isSuccess , deleteMutation.isError , deleteMutation.data , deleteMutation.error])


if(isLoading){

   return (
    <LoadingScreen  loadingMessage ='Fetching All Data' />
   )
}


  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Navbar activePage="admin" />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar activeTab="admin_categories" role="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-grid-pattern w-full min-w-0 overflow-y-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <div className="inline-block bg-yellow border-3 border-navy px-3 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-2">
               CAREER CATEGORY
              </div>
              <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy">
                Career Categories & <span className="text-rust">Skill Tags</span>
              </h1>
            </div>
            <Button clickAction={handleShowForm} variant="accent"  size="md">
              + Add New Category
            </Button>
          </div>
         {
          showForm && <CategoryForm key={editingCategory?._id || "new"} handleShowForm={handleShowForm} editingCategory={editingCategory} />
         }

          <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories?.map((cat) => {
              const isDeleting = deleteMutation.isPending && deleteId === cat._id
              return (
              <Card key={cat._id}  color="white">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-grotesk font-extrabold text-xl text-navy flex-1 min-w-0">{cat?.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      title="Edit category"
                      aria-label={`Edit ${cat?.title}`}
                      onClick={() => handleEdit(cat)}
                      className="w-8 h-8 flex items-center justify-center bg-yellow border-2 border-navy rounded-lg shadow-pop-sm hover:bg-yellow-fixed transition-all active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Pencil size={15} className="text-navy" />
                    </button>
                    <button
                      type="button"
                      title="Delete category"
                      aria-label={`Delete ${cat?.title}`}
                      disabled={isDeleting}
                      onClick={() => {
                        if (window.confirm(`Delete "${cat?.title}"? This cannot be undone.`)) handleDelete(cat._id)
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 border-2 border-navy rounded-lg shadow-pop-sm hover:bg-red-600 transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
                    >
                      {isDeleting
                        ? <Loader2 size={15} className="text-white animate-spin" />
                        : <Trash2 size={15} className="text-white" />}
                    </button>
                  </div>
                </div>
              </Card>
              )
            })}
          </div>
          {categories?.length === 0 && (
            <p className="font-body text-sm text-navy-muted text-center py-8">
              No categories yet — add your first one above.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
