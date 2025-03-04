import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api'

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error("server error")
      }
      navigate({ to: "/expenses" })
    },
  })

  return (
    <div className="flex justify-center items-center p-4">
      <div className="max-w-xl">
        <h2 className="text-center">Create Expense</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-y-4"
        >
          <form.Field
              name="title"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                  {field.state.meta.isValidating ? 'Validating...' : null}
                </>
              )}
            />

            <form.Field
              name="amount"
              children={(field) => (
                <>
                  <Label htmlFor="amount">Amount</Label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="number"
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="border rounded p-2 w-full"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                  {field.state.meta.isValidating ? 'Validating...' : null}
                </>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button className="mt-4 w-full" type="submit" disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Submit'}
                </Button>
              )}
            />
        </form>
      </div>
    </div>
  );
}
