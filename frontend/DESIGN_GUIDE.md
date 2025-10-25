# 🎨 Guia de Design Centralizado

## Componentes de Layout Criados

### 1. `CenteredLayout`
Layout principal que centraliza todo o conteúdo:

```tsx
import { CenteredLayout } from '../components/common/Layout';

<CenteredLayout maxWidth="md">
  {/* Seu conteúdo aqui */}
</CenteredLayout>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (padrão: 'md')
- `className`: classes CSS adicionais
- `noPadding`: remove padding padrão

### 2. `PageContainer`
Container de página com título e botão de voltar:

```tsx
import { PageContainer } from '../components/common/Layout';

<PageContainer 
  title="Meus Treinos"
  subtitle="Gerencie seus treinos"
  maxWidth="lg"
  showBackButton
  onBack={() => navigate(-1)}
>
  {/* Conteúdo da página */}
</PageContainer>
```

### 3. `Card`
Cards padronizados:

```tsx
import { Card } from '../components/common/Layout';

<Card hover onClick={() => navigate('/treino/123')}>
  <h3>Treino A</h3>
  <p>3 exercícios</p>
</Card>
```

### 4. `Section`
Seções com título:

```tsx
import { Section } from '../components/common/Layout';

<Section title="Exercícios">
  {/* Cards de exercícios */}
</Section>
```

### 5. `Button`
Botões padronizados:

```tsx
import { Button } from '../components/common/Layout';

<Button 
  variant="primary"  // primary, secondary, outline, danger
  size="lg"          // sm, md, lg
  fullWidth
  onClick={handleClick}
>
  Começar Treino
</Button>
```

## Classes CSS Utilitárias

### Criadas no `index.css`:

```css
.app-container       /* Container principal (max-width: 28rem) */
.page-wrapper        /* Wrapper de página com fundo */
.content-center      /* Centraliza conteúdo horizontalmente */
.card-base          /* Card básico branco */
.btn-primary        /* Botão primário azul */
.btn-secondary      /* Botão secundário cinza */
.center-content     /* Flex center (x e y) */
.center-x           /* Centraliza horizontalmente */
.center-y           /* Centraliza verticalmente */
```

## Exemplos de Uso

### Página de Lista

```tsx
import { PageContainer, Card, Section } from '../components/common/Layout';

export function MyWorkoutsPage() {
  return (
    <PageContainer 
      title="Meus Treinos"
      maxWidth="lg"
      showBackButton
      onBack={() => navigate('/home')}
    >
      <Section title="Treinos Ativos">
        <div className="space-y-4">
          {workouts.map(workout => (
            <Card key={workout.id} hover onClick={() => selectWorkout(workout.id)}>
              <h3 className="font-bold text-lg">{workout.name}</h3>
              <p className="text-gray-600">{workout.exercises.length} exercícios</p>
            </Card>
          ))}
        </div>
      </Section>
    </PageContainer>
  );
}
```

### Página de Form

```tsx
import { CenteredLayout, Button } from '../components/common/Layout';

export function CreateWorkoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <CenteredLayout maxWidth="sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Criar Treino
          </h1>
          
          <form className="space-y-4">
            <input 
              className="w-full rounded-2xl px-4 py-3 border"
              placeholder="Nome do treino"
            />
            
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Criar
            </Button>
          </form>
        </div>
      </CenteredLayout>
    </div>
  );
}
```

### Página com Cards de Grid

```tsx
import { PageContainer, Card } from '../components/common/Layout';

export function ExercisesPage() {
  return (
    <PageContainer title="Exercícios" maxWidth="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map(exercise => (
          <Card key={exercise.id} hover>
            <img src={exercise.gifUrl} alt={exercise.name} className="rounded-lg mb-3" />
            <h3 className="font-semibold">{exercise.name}</h3>
            <p className="text-sm text-gray-600">{exercise.bodyPart}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
```

## Padrões de Design

### Cores
- **Primary**: Blue (#3B82F6)
- **Background**: Gray-50 (#F9FAFB)
- **Cards**: White com shadow-md
- **Text**: Gray-900 (títulos), Gray-600 (subtítulos)

### Espaçamentos
- **Entre seções**: `mb-6` ou `space-y-6`
- **Entre cards**: `gap-4` ou `space-y-4`
- **Padding interno**: `p-6` (cards), `px-4 py-6` (pages)

### Bordas
- **Arredondadas**: `rounded-2xl` (cards), `rounded-xl` (buttons)
- **Sombras**: `shadow-md` (cards), `shadow-lg` (hover)

### Responsividade
Todos os componentes são mobile-first e responsivos:
- Mobile: 100% width com padding
- Desktop: max-width centralizado

## Migração de Páginas Antigas

Para migrar uma página antiga:

1. **Importar componentes**:
```tsx
import { PageContainer, Card, Button } from '../components/common/Layout';
```

2. **Substituir container principal**:
```tsx
// Antes
<div className="some-wrapper">
  <div className="some-container">
    {content}
  </div>
</div>

// Depois
<PageContainer title="Título">
  {content}
</PageContainer>
```

3. **Substituir cards customizados**:
```tsx
// Antes
<div className="custom-card">...</div>

// Depois
<Card>...</Card>
```

4. **Substituir botões**:
```tsx
// Antes
<button className="custom-button">Click</button>

// Depois
<Button variant="primary">Click</Button>
```

## Páginas Já Atualizadas

✅ `LoginPageNew.tsx` - Login modernizado
✅ `RegisterPageNew.tsx` - Registro modernizado

## Próximas Páginas para Atualizar

- [ ] Home.tsx
- [ ] TreinoPage.tsx
- [ ] StreakPage.tsx
- [ ] MyWorkoutsPage.tsx
- [ ] ExerciseIdPage.tsx
- [ ] Onboarding pages

## Dicas

1. **Sempre use CenteredLayout** como wrapper principal
2. **Use PageContainer** para páginas com título
3. **Cards sempre com hover** para elementos clicáveis
4. **Buttons sempre com variant** (primary, secondary, outline, danger)
5. **Espaçamento consistente** com `space-y-4` ou `gap-4`
6. **Text colors** sempre Gray-900 (títulos) e Gray-600 (subtítulos)
