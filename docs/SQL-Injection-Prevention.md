## Prevención de SQL Injection

Todas las consultas usan **parámetros vinculados** (`$1`, `$2`) del driver `pg`, 
que escapa automáticamente los valores. Además, Zod valida los inputs antes de 
que lleguen a la base de datos.

Ejemplo seguro:
```typescript
pool.query('SELECT * FROM usuarios WHERE email=$1', [email])