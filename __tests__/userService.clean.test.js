const { UserService } = require('../src/userService');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe('createUser', () => {
    test('deve gerar um id ao criar um usuário válido', () => {
      // Arrange
      const nome = 'Fulano de Tal';
      const email = 'fulano@teste.com';
      const idade = 25;

      // Act
      const usuario = userService.createUser(nome, email, idade);

      // Assert
      expect(usuario.id).toBeDefined();
    });

    test('deve criar o usuário com status ativo', () => {
      // Arrange
      const idade = 25;

      // Act
      const usuario = userService.createUser('Fulano', 'fulano@teste.com', idade);

      // Assert
      expect(usuario.status).toBe('ativo');
    });

    test('deve lançar erro ao criar usuário menor de idade', () => {
      // Arrange
      const idadeMenor = 17;

      // Act
      const criarUsuarioMenor = () =>
        userService.createUser('Menor', 'menor@email.com', idadeMenor);

      // Assert
      expect(criarUsuarioMenor).toThrow('O usuário deve ser maior de idade.');
    });
  });

  describe('getUserById', () => {
    test('deve retornar o usuário cadastrado pelo id', () => {
      // Arrange
      const usuarioCriado = userService.createUser('Fulano', 'fulano@teste.com', 25);

      // Act
      const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado).toEqual(usuarioCriado);
    });
  });

  describe('deactivateUser', () => {
    test('deve desativar um usuário comum', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      const resultado = userService.deactivateUser(usuarioComum.id);

      // Assert
      expect(resultado).toBe(true);
      expect(userService.getUserById(usuarioComum.id).status).toBe('inativo');
    });

    test('não deve desativar um usuário administrador', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      const resultado = userService.deactivateUser(usuarioAdmin.id);

      // Assert
      expect(resultado).toBe(false);
      expect(userService.getUserById(usuarioAdmin.id).status).toBe('ativo');
    });
  });

  describe('generateUserReport', () => {
    test('deve incluir os dados de todos os usuários cadastrados no relatório', () => {
      // Arrange
      const alice = userService.createUser('Alice', 'alice@email.com', 28);
      const bob = userService.createUser('Bob', 'bob@email.com', 32);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain(alice.id);
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain(bob.id);
      expect(relatorio).toContain('Bob');
    });

    test('deve informar no relatório quando não há usuários cadastrados', () => {
      // Arrange (banco vazio, garantido pelo beforeEach)

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('Nenhum usuário cadastrado');
    });
  });
});
