<template>
  <FloatingConfigurator />
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
        "
      >
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <img src="/logo.png" width="80px" class="mx-auto mb-2" />

            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Smart Expense Crontrol</div>
            <span class="text-muted-color font-medium">Sign in to continue</span>
          </div>

          <form @submit.prevent="submitLogin">
            <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
              Usuario
            </label>
            <InputText
              id="username"
              v-model="username"
              autocomplete="username"
              type="text"
              placeholder="Usuario"
              class="w-full md:w-[30rem] mb-8"
              @blur="usernameBlur"
            />
            <p v-if="usernameError" class="text-red-500 text-sm">{{ usernameError }}</p>

            <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">
              Password
            </label>
            <Password
              id="password"
              v-model="password"
              placeholder="Contraseña"
              toggle-mask
              class="mb-4"
              fluid
              autocomplete="current-password"
              :feedback="false"
              @blur="passwordBlur"
            />
            <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>

            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
              <div class="flex items-center">
                <Checkbox id="rememberme1" v-model="checked" binary class="mr-2" />
                <label for="rememberme1">Remember me</label>
              </div>
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
            </div>
            <Button label="Sign In" class="w-full" type="submit" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { unAuthAxios } from "@/composables/useAxios";
import { setSession } from "@/composables/useUtils";
import { apiV1 } from "@/config/endpoints";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string({ required_error: "El usuario es requerido" }),
  password: z
    .string({ required_error: "la contraseña es requerida" })
    .min(5, "la contraseña debe tener minimo 5 caracteres"),
});

const checked = ref(false);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  validateOnMount: false,
});

const { value: username, errorMessage: usernameError, handleBlur: usernameBlur } = useField("username");
const { value: password, errorMessage: passwordError, handleBlur: passwordBlur } = useField("password");

const submitLogin = handleSubmit(async () => {
  const formData = {
    username: username.value,
    password: password.value,
  };
  try {
    const { data } = await unAuthAxios.post(apiV1.login, formData);
    await setSession({
      token: data.token,
      user: data.expiration,
    });

    location.reload();
  } catch (error) {
    console.error("Error al hacer login:", error?.response?.data || error.message);
  }
});
</script>
<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
